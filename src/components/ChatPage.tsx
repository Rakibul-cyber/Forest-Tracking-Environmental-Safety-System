import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Users, Plus, Search, ArrowLeft, X } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  groupId: string;
}

interface Group {
  id: string;
  name: string;
  members: number;
  lastMessage?: string;
}

interface ChatPageProps {
  currentUser: any;
}

export function ChatPage({ currentUser }: ChatPageProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load groups from localStorage
    const savedGroups = localStorage.getItem('chatGroups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    } else {
      // Initialize with default groups
      const defaultGroups: Group[] = [
        { id: '1', name: 'General Discussion', members: 12, lastMessage: 'Hey team, how are the inspections going?' },
        { id: '2', name: 'Field Team Alpha', members: 5, lastMessage: 'Found some diseased trees in sector 3' },
        { id: '3', name: 'Data Analysis', members: 8, lastMessage: 'The latest reports are ready for review' },
        { id: '4', name: 'Urgent Alerts', members: 15, lastMessage: 'Critical tree #87 needs immediate attention' },
      ];
      setGroups(defaultGroups);
      localStorage.setItem('chatGroups', JSON.stringify(defaultGroups));
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with sample messages
      const sampleMessages: Message[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Sarah Johnson',
          text: 'Hey team, how are the inspections going?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          groupId: '1'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Mike Chen',
          text: 'Going well! Covered sector 2 this morning.',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          groupId: '1'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Emma Davis',
          text: 'Found some diseased trees in sector 3. Taking photos now.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          groupId: '2'
        },
      ];
      setMessages(sampleMessages);
      localStorage.setItem('chatMessages', JSON.stringify(sampleMessages));
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
      groupId: selectedGroup.id
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    // Update last message in group
    const updatedGroups = groups.map(g => 
      g.id === selectedGroup.id ? { ...g, lastMessage: newMessage } : g
    );
    setGroups(updatedGroups);
    localStorage.setItem('chatGroups', JSON.stringify(updatedGroups));

    setNewMessage('');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      members: 1,
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('chatGroups', JSON.stringify(updatedGroups));

    setNewGroupName('');
    setShowCreateGroup(false);
    setSelectedGroup(newGroup);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupMessages = selectedGroup
    ? messages.filter(m => m.groupId === selectedGroup.id)
    : [];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Mobile view: Show conversation when group is selected
  if (selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSelectedGroup(null)}
              className="p-1"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-white">{selectedGroup.name}</h1>
              <p className="text-green-100 text-sm">{selectedGroup.members} members</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {groupMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            groupMessages.map((message) => {
              const isCurrentUser = message.userId === currentUser.id;
              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {!isCurrentUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-300 text-xs">
                        {getInitials(message.userName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    {!isCurrentUser && (
                      <span className="text-xs text-gray-500 mb-1 px-1">{message.userName}</span>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-green-600 text-white rounded-br-sm'
                          : 'bg-white border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 h-12"
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 h-12 w-12 p-0">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Mobile view: Show groups list
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white">Team Chat</h1>
            <p className="text-green-100 text-sm">{groups.length} groups</p>
          </div>
          <Button 
            onClick={() => setShowCreateGroup(true)}
            size="sm"
            className="bg-green-600 hover:bg-green-800 text-white"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Groups List */}
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className="p-4 bg-white border border-gray-200 rounded-lg active:bg-gray-50"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{group.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{group.members} members</p>
                  {group.lastMessage && (
                    <p className="text-sm text-gray-600 mt-1 truncate">{group.lastMessage}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2>Create New Group</h2>
              <button
                onClick={() => {
                  setShowCreateGroup(false);
                  setNewGroupName('');
                }}
                className="p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Group Name</label>
                <Input
                  placeholder="Enter group name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mt-2 h-12"
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 h-12">
                  Create Group
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateGroup(false);
                    setNewGroupName('');
                  }}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
