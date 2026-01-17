import { useState, useEffect, useRef, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from 'constants/api';

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
    
    const characterCount = readInt32(data.buffer, data.byteOffset + offset);
    offset += 4;
    
    const characters = [];
    
    for (let i = 0; i < characterCount; i++) {
      // Read character ID
      const idLength = readInt32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const idBytes = new Uint8Array(data.buffer, data.byteOffset + offset, idLength);
      const playerId = new TextDecoder().decode(idBytes);
      offset += idLength;
      
      // Read position (3 floats for 2D + rotation)
      const x = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const y = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const rotation = readFloat32(data.buffer, data.byteOffset + offset);
      offset += 4;
      
      // Read color
      const colorLength = readInt32(data.buffer, data.byteOffset + offset);
      offset += 4;
      const colorBytes = new Uint8Array(data.buffer, data.byteOffset + offset, colorLength);
      const color = new TextDecoder().decode(colorBytes);
      offset += colorLength;
      
      characters.push({
        id: playerId,
        position: [x, y, rotation],
        color
      });
    }
    
    return {
      tickNumber,
      characters
    };
  } catch (error) {
    console.error('Error parsing binary snapshot:', error);
    return null;
  }
}

// Process binary message (centralized parser)
function processBinaryMessage(data) {
  try {
    if (data.length === 0) return null;
    
    const messageType = data[0];
    const messageData = data.slice(1);
    
    if (messageType === 2) { // Welcome message (JSON)
      const json = new TextDecoder().decode(messageData);
      const welcome = JSON.parse(json);
      return { type: 'welcome', data: welcome };
    } else if (messageType === 3) { // Snapshot message (binary format)
      const snapshot = parseBinarySnapshot(messageData);
      return { type: 'snapshot', data: snapshot };
    } else {
      console.warn(`Unknown message type: ${messageType}`);
      return null;
    }
  } catch (error) {
    console.error(`Error parsing UDP proxy message:`, error);
    return null;
  }
}

// Simple connection state to prevent duplicates
const activeConnections = new Set();

export function useUdpConnection(token, character) {
  const [tickNumber, setTickNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const [serverCharacterId, setServerCharacterId] = useState(null);
  const lastMessageRef = useRef(null);
  const connectionId = useRef(`conn_${Math.random().toString(36).substr(2, 9)}`);

  // Create a stable URL that doesn't change on re-renders
  const webSocketUrl = useMemo(() => {
    return token ? `${WS_URL}/udp-proxy` : null;
  }, [token]);

  // Simple connection management - always connect if we have a URL
  const shouldConnect = !!webSocketUrl;

  // Use WebSocket for UDP proxy since WebRTC requires complex signaling
  const { sendJsonMessage, lastBinaryMessage, readyState, getWebSocket } = useWebSocket(
    shouldConnect ? webSocketUrl : null,
    {
      shouldReconnect: () => true,
      onOpen: () => {
        activeConnections.add(connectionId.current);
      },
      onClose: () => {
        activeConnections.delete(connectionId.current);
      },
      onError: (event) => {
        console.log(`[${connectionId.current}] WebSocket ERROR:`, event);
      },
      onMessage: (event) => {
        // Handle binary Blob messages manually
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result;
            const data = new Uint8Array(arrayBuffer);
            const message = processBinaryMessage(data);
            
            if (message) {
              if (message.type === 'welcome') {
                setTickNumber(message.data.tickNumber);
                if (message.data.playerId) {
                  setServerCharacterId(message.data.playerId);
                }
              } else if (message.type === 'snapshot' && message.data) {
                setTickNumber(message.data.tickNumber);
                setSnapshot(message.data);
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
      
      const data = new Uint8Array(lastBinaryMessage);
      const message = processBinaryMessage(data);
      
      if (message) {
        if (message.type === 'welcome') {
          setTickNumber(message.data.tickNumber);
          if (message.data.playerId) {
            setServerCharacterId(message.data.playerId);
          }
        } else if (message.type === 'snapshot' && message.data) {
          setTickNumber(message.data.tickNumber);
          setSnapshot(message.data);
        }
      }
    }
  }, [lastBinaryMessage]);

  useEffect(() => {
    if (connected && token) {
      // Send HELLO message with ticket
      const sendHello = async () => {
        try {
          const response = await fetch(`${window.location.hostname.includes("localhost") ? "http://localhost:5022" : "https://blue-api-prod.fly.dev"}/api/udp-ticket`, {
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
              console.error(`[${connectionId.current}] No ticket ID in response:`, ticketData);
              return;
            }
            
            const helloMessage = JSON.stringify({ ticket: ticketId, characterId: character?.id });
            const messageBytes = new TextEncoder().encode(helloMessage);
            const packet = new Uint8Array(messageBytes.length + 1);
            packet[0] = 1; // HELLO message type
            packet.set(messageBytes, 1);
            
            // Send binary message
            const websocket = getWebSocket();
            if (websocket && websocket.readyState === WebSocket.OPEN) {
              websocket.send(packet);
            } else {
              console.error(`[${connectionId.current}] WebSocket not ready for HELLO`);
            }
          } else {
            console.error(`[${connectionId.current}] Failed to get ticket: ${response.status}`);
          }
        } catch (error) {
          console.error(`[${connectionId.current}] Error sending HELLO via UDP proxy:`, error);
        }
      };

      sendHello();
    } else {
      console.log(`[${connectionId.current}] Not sending HELLO - connected: ${connected}, has token: ${!!token}`);
    }
  }, [connected, token, getWebSocket]);

  const sendPosition = (position) => {
    if (!connected) {
      console.log('UDP proxy not connected, would send position:', position);
      return;
    }

    try {
      const inputMessage = JSON.stringify(position);
      
      // Create message with INPUT type prefix (4)
      const messageBytes = new TextEncoder().encode(inputMessage);
      const packet = new Uint8Array(messageBytes.length + 1);
      packet[0] = 4; // INPUT message type
      packet.set(messageBytes, 1);

      // Send binary message
      const websocket = getWebSocket();
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(packet);
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

  return { connected, tickNumber, snapshot, sendPosition, disconnect, characterId: serverCharacterId };
}
