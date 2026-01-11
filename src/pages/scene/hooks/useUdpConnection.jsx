import { useState, useEffect, useRef, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

const SERVER_URL = window.location.hostname.includes("localhost")
  ? "ws://localhost:5022"
  : "wss://blue.fly.dev";

// Parse binary snapshot from server's SerializeSnapshotBinary format
function parseBinarySnapshot(data) {
  try {
    let offset = 0;
    
    // Helper function to read little-endian values
    const readInt64 = (buffer, offset) => {
      const view = new DataView(buffer, offset, 8);
      return view.getBigUint64(0, true);
    };
    
    const readInt32 = (buffer, offset) => {
      const view = new DataView(buffer, offset, 4);
      return view.getInt32(0, true);
    };
    
    const readFloat32 = (buffer, offset) => {
      const view = new DataView(buffer, offset, 4);
      return view.getFloat32(0, true);
    };
    
    // Read header
    const tickNumber = Number(readInt64(data.buffer, data.byteOffset + offset));
    offset += 8;
    
    const playerCount = readInt32(data.buffer, data.byteOffset + offset);
    offset += 4;
    
    const players = [];
    
    for (let i = 0; i < playerCount; i++) {
      // Read player ID
      const idLength = readInt32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const idBytes = new Uint8Array(data.buffer, data.byteOffset + offset, idLength);
      const playerId = new TextDecoder().decode(idBytes);
      offset += idLength;
      
      // Read position (4 floats)
      const x = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const y = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const z = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const rotationY = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      
      // Read color
      const colorLength = readInt32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const colorBytes = new Uint8Array(data.buffer, data.byteOffset + offset, colorLength);
      const color = new TextDecoder().decode(colorBytes);
      offset += colorLength;
      
      // Read last update (8 bytes)
      const lastUpdate = Number(readInt64(data.buffer, data.byteOffset + offset));
      offset += 8;
      
      players.push({
        id: playerId,
        position: { x, y, z, rotationY },
        color,
        lastUpdate: new Date(lastUpdate)
      });
    }
    
    return {
      tickNumber,
      players
    };
  } catch (error) {
    console.error('Error parsing binary snapshot:', error);
    return null;
  }
}

// Global connection cache to prevent duplicate connections
const connectionCache = new Map();

export function useUdpConnection(token, playerId) {
  const [tickNumber, setTickNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const [serverPlayerId, setServerPlayerId] = useState(null);
  const lastMessageRef = useRef(null);
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Create a stable URL that doesn't change on re-renders
  const webSocketUrl = useMemo(() => {
    // Don't pass playerId in URL - let server generate it
    const url = token ? `${SERVER_URL}/udp-proxy` : null
    return url
  }, [token])

  // Check if we already have a connection for this playerId
  const existingConnection = connectionCache.get(serverPlayerId)
  
  // Always create connection if we don't have one, never pass null to close it
  const shouldCreateConnection = webSocketUrl && !existingConnection
  const shouldMaintainConnection = existingConnection && webSocketUrl

  // Use WebSocket for UDP proxy since WebRTC requires complex signaling
  const { sendJsonMessage, lastBinaryMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    shouldCreateConnection ? webSocketUrl : (shouldMaintainConnection ? webSocketUrl : null),
    {
      shouldReconnect: () => true,
      onOpen: () => {
        if (serverPlayerId && !connectionCache.has(serverPlayerId)) {
          connectionCache.set(serverPlayerId, true);
        }
      },
      onClose: (event) => {
        // Don't immediately remove from cache, let it timeout
        setTimeout(() => {
          if (connectionCache.get(serverPlayerId) === true) {
            connectionCache.delete(serverPlayerId);
          }
        }, 5000);
      },
      onError: (event) => {
        console.log(`[${instanceId.current}] WebSocket ERROR for serverPlayerId:`, serverPlayerId, event);
      },
      onMessage: (event) => {
        
        // Handle binary Blob messages manually
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result;
            const data = new Uint8Array(arrayBuffer);
                        
            // Process the binary message
            if (data.length > 0) {
              const messageType = data[0];
              const messageData = data.slice(1);
                            
              if (messageType === 2) { // Welcome message (JSON)
                const json = new TextDecoder().decode(messageData);
                const welcome = JSON.parse(json);
                setTickNumber(welcome.tickNumber);
                // Store the server-generated playerId
                if (welcome.playerId) {
                  setServerPlayerId(welcome.playerId);
                }
              } else if (messageType === 3) { // Snapshot message (binary format)
                const snapshot = parseBinarySnapshot(messageData);
                if (snapshot) {
                  setTickNumber(snapshot.tickNumber);
                  setSnapshot(snapshot);
                } else {
                  console.error(`[${instanceId.current}] Failed to parse snapshot from Blob`);
                }
              } else {
                console.warn(`[${instanceId.current}] Unknown message type from Blob: ${messageType}`);
              }
            }
          };
          reader.readAsArrayBuffer(event.data);
        }
      }
    }
  );

  const connected = readyState === 1;

  // Handle binary messages from WebSocket proxy
  useEffect(() => {
    if (lastBinaryMessage !== null && lastBinaryMessage !== undefined && lastBinaryMessage !== lastMessageRef.current) {
      lastMessageRef.current = lastBinaryMessage;
      
      try {
        const data = new Uint8Array(lastBinaryMessage);

        if (data.length === 0) {
          return;
        }
        
        const messageType = data[0];
        const messageData = data.slice(1);
        
        
        if (messageType === 2) { // Welcome message (JSON)
          const json = new TextDecoder().decode(messageData);
          const welcome = JSON.parse(json);
          setTickNumber(welcome.tickNumber);
          // Store the server-generated playerId
          if (welcome.playerId) {
            setServerPlayerId(welcome.playerId);
          }
        } else if (messageType === 3) { // Snapshot message (binary format)
          const snapshot = parseBinarySnapshot(messageData);
          if (snapshot) {
            setTickNumber(snapshot.tickNumber);
            setSnapshot(snapshot);
          } else {
            console.error(`[${instanceId.current}] Failed to parse snapshot`);
          }
        } else {
          console.warn(`[${instanceId.current}] Unknown message type: ${messageType}`);
        }
      } catch (error) {
        console.error(`[${instanceId.current}] Error parsing UDP proxy message:`, error);
      }
    }
  }, [lastBinaryMessage]);

  useEffect(() => {
    if (connected && token) {
      // Send HELLO message with ticket
      const sendHello = async () => {
        try {
          const response = await fetch(`${window.location.hostname.includes("localhost") ? "http://localhost:5022" : "https://blue.fly.dev"}/api/udp-ticket`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const ticketData = await response.json();
            
            // Check if ticketData has ticketId or ticket property
            const ticketId = ticketData.ticketId || ticketData.ticket;
            if (!ticketId) {
              console.error(`[${instanceId.current}] No ticket ID in response:`, ticketData);
              return;
            }
            
            const helloMessage = JSON.stringify({ ticket: ticketId });
            const messageBytes = new TextEncoder().encode(helloMessage);
            const packet = new Uint8Array(messageBytes.length + 1);
            packet[0] = 1; // HELLO message type
            packet.set(messageBytes, 1);
            
            // Send binary message
            const websocket = getWebSocket();
            if (websocket && websocket.readyState === WebSocket.OPEN) {
              websocket.send(packet);
            } else {
              console.error(`[${instanceId.current}] WebSocket not ready for HELLO`);
            }
          } else {
            console.error(`[${instanceId.current}] Failed to get ticket: ${response.status}`);
          }
        } catch (error) {
          console.error(`[${instanceId.current}] Error sending HELLO via UDP proxy:`, error);
        }
      };

      sendHello();
    } else {
      console.log(`[${instanceId.current}] Not sending HELLO - connected: ${connected}, has token: ${!!token}`);
    }
  }, [connected, token, getWebSocket]);

  const sendPosition = (x, y, z, rotationY) => {
    if (!connected) {
      console.log('UDP proxy not connected, would send position:', { x, y, z, rotationY });
      return;
    }

    try {
      const inputMessage = JSON.stringify({ x, y, z, rotationY });
      
      // Create message with INPUT type prefix (4)
      const messageBytes = new TextEncoder().encode(inputMessage);
      const packet = new Uint8Array(messageBytes.length + 1);
      packet[0] = 4; // INPUT message type
      packet.set(messageBytes, 1);

      // Send binary message
      const websocket = getWebSocket();
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(packet);
        console.log('Sent position via UDP proxy:', { x, y, z, rotationY });
      }
    } catch (error) {
      console.error('Error sending position via UDP proxy:', error);
    }
  };

  const disconnect = () => {
    const websocket = getWebSocket();
    if (websocket) {
      websocket.close();
    }
  };

  return { connected, tickNumber, snapshot, sendPosition, disconnect, playerId: serverPlayerId };
}
