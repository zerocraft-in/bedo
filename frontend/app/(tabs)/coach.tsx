import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, useColorScheme,
  ActivityIndicator, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../utils/theme';
import { ChatMessage } from '../../types';

const QUICK_PROMPTS = [
  "Motivate me! 💪",
  "Suggest a workout",
  "Recovery tips",
  "Nutrition advice",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm FitAI, your personal fitness coach. I'm here to help you stay motivated, plan workouts, and crush your goals. What can I help you with today? 🏋️‍♀️",
  timestamp: new Date().toISOString(),
};

function TypingIndicator({ colors }: { colors: typeof Colors.dark }) {
  return (
    <View style={[typingStyles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={typingStyles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[typingStyles.dot, { backgroundColor: colors.primary }]} />
        ))}
      </View>
    </View>
  );
}

export default function CoachScreen() {
  const { user, chatMessages, addChatMessage, sessionId, themeMode } = useAppStore();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const allMessages = chatMessages.length === 0 ? [WELCOME_MESSAGE] : chatMessages;

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [allMessages.length, isLoading]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: msg,
          user_name: user.name,
          streak: user.streak,
          total_workouts: user.totalWorkouts,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        addChatMessage({
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error('API error');
      }
    } catch {
      addChatMessage({
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: "You're doing amazing! Every workout counts. Keep pushing — your future self will thank you for showing up today! 💪",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={22} color="#fff" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerName, { color: colors.textPrimary }]}>FitAI Coach</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>Online • AI Powered</Text>
            </View>
          </View>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Coach intro banner */}
          <View style={[styles.introBanner, { backgroundColor: colors.surface }]}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1687844599821-e0eceea6f6a1?w=400&q=60' }}
              style={styles.introBg}
              imageStyle={{ borderRadius: 16, opacity: 0.3 }}
            >
              <View style={[styles.introContent, { backgroundColor: 'transparent' }]}>
                <Text style={styles.introEmoji}>🤖</Text>
                <Text style={[styles.introTitle, { color: colors.primary }]}>Emergent AI Coach</Text>
                <Text style={[styles.introSub, { color: colors.textSecondary }]}>
                  Powered by GPT-5.4 · Personalized for you
                </Text>
              </View>
            </ImageBackground>
          </View>

          {allMessages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={[styles.aiAvatarSmall, { backgroundColor: colors.primary }]}>
                  <Ionicons name="sparkles" size={12} color="#fff" />
                </View>
              )}
              <View
                style={[
                  styles.bubbleContent,
                  msg.role === 'user'
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                ]}
              >
                <Text style={[styles.bubbleText, { color: msg.role === 'user' ? '#fff' : colors.textPrimary }]}>
                  {msg.content}
                </Text>
                <Text style={[styles.bubbleTime, { color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : colors.textMuted }]}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.bubble, styles.aiBubble]}>
              <View style={[styles.aiAvatarSmall, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={12} color="#fff" />
              </View>
              <TypingIndicator colors={colors} />
            </View>
          )}
        </ScrollView>

        {/* Quick prompts */}
        {!isLoading && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickPrompts}
            contentContainerStyle={styles.quickPromptsContent}
          >
            {QUICK_PROMPTS.map(p => (
              <TouchableOpacity
                key={p}
                testID={`quick-prompt-${p}`}
                style={[styles.promptChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => sendMessage(p)}
              >
                <Text style={[styles.promptText, { color: colors.textPrimary }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: 12 }]}>
          <TextInput
            testID="chat-input"
            style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="Ask your coach anything..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            testID="send-message-btn"
            style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.border }]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  aiAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 17, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22C55E' },
  statusText: { fontSize: 12 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12, paddingBottom: 24 },
  introBanner: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  introBg: { width: '100%' },
  introContent: { padding: 16, alignItems: 'center', gap: 4 },
  introEmoji: { fontSize: 32, marginBottom: 4 },
  introTitle: { fontSize: 18, fontWeight: '800' },
  introSub: { fontSize: 12 },
  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiBubble: { alignSelf: 'flex-start' },
  aiAvatarSmall: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubbleContent: { borderRadius: 18, padding: 12, maxWidth: '100%' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  quickPrompts: { maxHeight: 48 },
  quickPromptsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  promptChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, flexShrink: 0 },
  promptText: { fontSize: 13, fontWeight: '500' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent:"center", padding: 12, gap: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, borderWidth: 1, maxHeight: 100, minHeight: 44 },
  sendBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});

const typingStyles = StyleSheet.create({
  container: { borderRadius: 18, padding: 14, borderWidth: 1 },
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});
