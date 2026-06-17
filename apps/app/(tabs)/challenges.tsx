import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";


const { width } = Dimensions.get("window");

export default function ChallengesScreen() {
  const [repCount] = useState(18);
  const [verified] = useState(true);

  const leaderboard = [
    { rank: 1, name: "Alex", xp: 15420 },
    { rank: 2, name: "Sarah", xp: 14890 },
    { rank: 3, name: "Maran", xp: 13850 },
    { rank: 4, name: "John", xp: 12540 },
  ];

  const friends = [
    {
      id: 1,
      name: "David",
      challenge: "100 Pushups",
      progress: 65,
    },
    {
      id: 2,
      name: "Kevin",
      challenge: "50 Squats",
      progress: 80,
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "50 Pushups",
      current: 18,
      target: 50,
      xp: 100,
    },
    {
      id: 2,
      title: "100 Squats",
      current: 62,
      target: 100,
      xp: 250,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient
          colors={["#7C3AED", "#9333EA"]}
          style={styles.header}
        >
          {/* <Flame size={30} color="#fff" /> */}

          <Text style={styles.headerTitle}>
            7 Day Streak 🔥
          </Text>

          <Text style={styles.headerSub}>
            +120 XP this week
          </Text>
        </LinearGradient>

        {/* CHALLENGES */}
        <Text style={styles.sectionTitle}>
          Daily Challenges
        </Text>

        {challenges.map((item) => {
          const progress =
            (item.current / item.target) * 100;

          return (
            <View key={item.id} style={styles.card}>
              <Text style={styles.challengeTitle}>
                {item.title}
              </Text>

              <Text style={styles.progressText}>
                {item.current}/{item.target}
              </Text>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <Text style={styles.xpText}>
                🎁 +{item.xp} XP
              </Text>
            </View>
          );
        })}

        {/* WORKOUT VERIFICATION */}
        <Text style={styles.sectionTitle}>
          Workout Verification
        </Text>

        <TouchableOpacity style={styles.verifyCard}>
          {/* <Camera size={30} color="#8B5CF6" /> */}

          <View style={{ flex: 1 }}>
            <Text style={styles.verifyTitle}>
              AI Pose Verification
            </Text>

            <Text style={styles.verifySub}>
              Camera detects reps automatically
            </Text>
          </View>

          {/* <CheckCircle2
            size={24}
            color={verified ? "#22C55E" : "#EF4444"}
          /> */}
        </TouchableOpacity>

        <View style={styles.counterCard}>
          <Text style={styles.counterTitle}>
            Current Reps
          </Text>

          <Text style={styles.counter}>
            {repCount}
          </Text>

          <Text style={styles.detected}>
            Pose Detected ✅
          </Text>
        </View>

        {/* LEADERBOARD */}
        <View style={styles.rowHeader}>
          {/* <Trophy color="#FFD700" size={22} /> */}

          <Text style={styles.sectionTitle}>
            Global Leaderboard
          </Text>
        </View>

        {leaderboard.map((user) => (
          <View
            key={user.rank}
            style={styles.leaderboardCard}
          >
            <View style={styles.rankContainer}>
              {/* <Medal
                color={
                  user.rank === 1
                    ? "#FFD700"
                    : user.rank === 2
                    ? "#C0C0C0"
                    : "#CD7F32"
                }
              /> */}

              <Text style={styles.rank}>
                #{user.rank}
              </Text>
            </View>

            <Text style={styles.name}>
              {user.name}
            </Text>

            <Text style={styles.score}>
              {user.xp} XP
            </Text>
          </View>
        ))}

        {/* FRIEND CHALLENGES */}
        <View style={styles.rowHeader}>
          {/* <Users color="#60A5FA" size={22} /> */}

          <Text style={styles.sectionTitle}>
            Friends Challenges
          </Text>
        </View>

        {friends.map((friend) => (
          <View
            key={friend.id}
            style={styles.friendCard}
          >
            <Text style={styles.friendName}>
              {friend.name}
            </Text>

            <Text style={styles.friendChallenge}>
              {friend.challenge}
            </Text>

            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${friend.progress}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.friendProgress}>
              {friend.progress}% Complete
            </Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  header: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },

  headerSub: {
    color: "#ddd",
    marginTop: 5,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderRadius: 18,
  },

  challengeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  progressText: {
    color: "#94A3B8",
    marginTop: 5,
  },

  progressBg: {
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
  },

  xpText: {
    color: "#FACC15",
    marginTop: 10,
    fontWeight: "600",
  },

  verifyCard: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  verifyTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  verifySub: {
    color: "#94A3B8",
    marginTop: 4,
  },

  counterCard: {
    backgroundColor: "#1E293B",
    margin: 16,
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
  },

  counterTitle: {
    color: "#94A3B8",
  },

  counter: {
    fontSize: 54,
    color: "#fff",
    fontWeight: "bold",
  },

  detected: {
    color: "#22C55E",
    marginTop: 5,
  },

  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 16,
    gap: 10,
  },

  leaderboardCard: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
  },

  rank: {
    color: "#fff",
    marginLeft: 8,
  },

  name: {
    color: "#fff",
    flex: 1,
    fontWeight: "600",
  },

  score: {
    color: "#8B5CF6",
    fontWeight: "700",
  },

  friendCard: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 18,
  },

  friendName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  friendChallenge: {
    color: "#94A3B8",
    marginTop: 5,
  },

  friendProgress: {
    color: "#8B5CF6",
    marginTop: 10,
    fontWeight: "600",
  },
});