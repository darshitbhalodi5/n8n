"use client";

import React, { useState, useCallback } from "react";
import { Loader2, RefreshCw, Bot, Send, Trash2, MessageSquare, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTelegramConnection } from "@/hooks/useTelegramConnection";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import { API_CONFIG, buildApiUrl } from "@/config/api";
import type { TelegramChat, TelegramConnection } from "@/types/telegram";

interface TelegramMessage {
    updateId: number;
    messageId?: number;
    text?: string;
    from?: { id: number; firstName: string; username?: string };
    date: number;
}

interface TelegramNodeConfigurationProps {
    nodeData: Record<string, unknown>;
    handleDataChange: (updates: Record<string, unknown>) => void;
    authenticated: boolean;
    login: () => void;
}

function TelegramNodeConfigurationInner({
    nodeData,
    handleDataChange,
    authenticated,
    login,
}: TelegramNodeConfigurationProps) {
    const { getPrivyAccessToken } = usePrivyWallet();
    const {
        botInfo,
        connections,
        chats,
        loading,
        notification,
        selectedConnection,
        telegramMessage,
        actions,
    } = useTelegramConnection({
        nodeData,
        onDataChange: handleDataChange,
        authenticated,
    });

    // Message viewer state
    const [showMessages, setShowMessages] = useState(false);
    const [messages, setMessages] = useState<TelegramMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Load messages from backend
    const loadMessages = useCallback(async () => {
        if (!selectedConnection) return;

        setLoadingMessages(true);
        try {
            const accessToken = await getPrivyAccessToken();
            if (!accessToken) return;

            const response = await fetch(
                buildApiUrl(`${API_CONFIG.ENDPOINTS.TELEGRAM.CONNECTIONS}/${selectedConnection.id}/messages`),
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (response.ok) {
                const data = await response.json();
                setMessages(data.data.messages || []);
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    }, [selectedConnection, getPrivyAccessToken]);

    // Open message viewer
    const openMessageViewer = useCallback(() => {
        setShowMessages(true);
        loadMessages();
    }, [loadMessages]);

    // Show login prompt
    if (!authenticated) {
        return (
            <Card className="p-4 space-y-3">
                <Typography variant="bodySmall" className="font-semibold text-foreground">
                    Authentication Required
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                    Please log in to configure Telegram integration.
                </Typography>
                <Button onClick={login} className="w-full">
                    Login to Continue
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Notification */}
            {notification && (
                <div className={`p-3 rounded-lg text-sm ${notification.type === "error" ? "bg-destructive/10 text-destructive" :
                    notification.type === "success" ? "bg-green-500/10 text-green-600" :
                        "bg-blue-500/10 text-blue-600"
                    }`}>
                    {notification.message}
                </div>
            )}

            {/* Step 1: Bot Info */}
            <Card className="p-4 space-y-3">
                <Typography variant="bodySmall" className="font-semibold text-foreground">
                    1. FlowForge Telegram Bot
                </Typography>

                {loading.bot ? (
                    <div className="flex items-center gap-2 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading bot info...</span>
                    </div>
                ) : botInfo ? (
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary" />
                            <div>
                                <Typography variant="bodySmall" className="font-medium">
                                    @{botInfo.username}
                                </Typography>
                                <Typography variant="caption" className="text-muted-foreground">
                                    Add this bot to your chat, then click below
                                </Typography>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Typography variant="caption" className="text-destructive">
                        Bot not configured. Please contact support.
                    </Typography>
                )}
            </Card>

            {/* Step 2: Select Chat */}
            <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        2. Select Chat
                    </Typography>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={actions.loadChats}
                        disabled={loading.chats}
                        className="gap-1"
                    >
                        {loading.chats ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <RefreshCw className="w-3 h-3" />
                        )}
                        Find Chats
                    </Button>
                </div>

                {/* Available chats dropdown */}
                {chats.length > 0 && (
                    <div className="space-y-2">
                        <Typography variant="caption" className="text-muted-foreground">
                            Select a chat to connect:
                        </Typography>
                        <div className="space-y-1">
                            {chats.map((chat: TelegramChat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => actions.saveConnection(chat)}
                                    disabled={loading.saving}
                                    className="w-full p-2 text-left rounded-lg border border-border hover:bg-secondary/30 transition-colors text-sm"
                                >
                                    {chat.type === "channel" ? "# " : chat.type === "private" ? "@ " : ""}
                                    {chat.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Saved connections */}
                {connections.length > 0 && (
                    <div className="space-y-2">
                        <Typography variant="caption" className="text-muted-foreground">
                            Your connections:
                        </Typography>
                        {connections.map((conn: TelegramConnection) => (
                            <div
                                key={conn.id}
                                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${selectedConnection?.id === conn.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-secondary/30"
                                    }`}
                                onClick={() => actions.selectConnection(conn)}
                            >
                                <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{conn.chatTitle}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        actions.deleteConnection(conn.id);
                                    }}
                                    className="p-1 h-auto"
                                >
                                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* No connections */}
                {connections.length === 0 && chats.length === 0 && !loading.chats && (
                    <Typography variant="caption" className="text-muted-foreground text-center py-2">
                        Click &quot;Find Chats&quot; after adding the bot to your chat
                    </Typography>
                )}
            </Card>

            {/* Step 3: Message Template */}
            {selectedConnection && (
                <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Typography variant="bodySmall" className="font-semibold text-foreground">
                            3. Message Template
                        </Typography>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={openMessageViewer}
                            className="gap-1"
                        >
                            <MessageSquare className="w-3 h-3" />
                            View Messages
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Sending to: {selectedConnection.chatTitle}
                    </div>

                    <textarea
                        value={telegramMessage}
                        onChange={(e) => actions.updateMessage(e.target.value)}
                        placeholder="Hello from FlowForge! 🚀"
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows={3}
                    />

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={actions.sendPreviewMessage}
                        disabled={!telegramMessage.trim() || loading.sending}
                        className="w-full gap-2"
                    >
                        {loading.sending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Send Preview
                    </Button>
                </Card>
            )}

            {/* Message Viewer Popup */}
            {showMessages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <Typography variant="bodySmall" className="font-semibold">
                                    Incoming Messages
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={loadMessages}
                                    disabled={loadingMessages}
                                    className="p-1 h-auto"
                                >
                                    {loadingMessages ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowMessages(false)}
                                    className="p-1 h-auto"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <Typography variant="caption">
                                        No messages received yet.
                                    </Typography>
                                    <Typography variant="caption" className="block mt-1">
                                        Messages appear here when sent to the connected chat.
                                    </Typography>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.updateId}
                                        className="p-3 rounded-lg bg-secondary/30 border border-border"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <Typography variant="caption" className="font-medium text-primary">
                                                {msg.from?.firstName || "Unknown"}
                                                {msg.from?.username && (
                                                    <span className="text-muted-foreground ml-1">
                                                        @{msg.from.username}
                                                    </span>
                                                )}
                                            </Typography>
                                            <Typography variant="caption" className="text-muted-foreground">
                                                {new Date(msg.date * 1000).toLocaleTimeString()}
                                            </Typography>
                                        </div>
                                        <Typography variant="bodySmall" className="text-foreground">
                                            {msg.text || "[No text]"}
                                        </Typography>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-border bg-secondary/20">
                            <Typography variant="caption" className="text-muted-foreground text-center block">
                                {messages.length} message{messages.length !== 1 ? "s" : ""} • From webhook
                            </Typography>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function TelegramNodeConfiguration(props: TelegramNodeConfigurationProps) {
    return (
        <ErrorBoundary
            fallback={(error, reset) => (
                <Card className="p-4 space-y-3">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        Telegram Configuration Error
                    </Typography>
                    <Typography variant="caption" className="text-destructive">
                        {error.message}
                    </Typography>
                    <Button type="button" variant="outline" onClick={reset} className="w-full">
                        Try Again
                    </Button>
                </Card>
            )}
        >
            <TelegramNodeConfigurationInner {...props} />
        </ErrorBoundary>
    );
}
