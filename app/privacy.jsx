import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacySecurity() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FBEEFC" }}
      edges={["top", "left", "right"]}
    >
      {/* ✅ SAME STATUSBAR STYLE AS SETTINGS */}
      <StatusBar backgroundColor="#FBEEFC" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ backgroundColor: "#f7f7fb" }}
      >
        <View>{/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            height: 180,
            backgroundColor: "#FBEEFC",
            paddingTop: 50,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Gilroy-Bold",
              fontSize: 22,
              marginLeft: 10,
            }}
          >
            Privacy & Security
          </Text>
        </View>
        <Text style={styles.heading}>Your Privacy Matters</Text>
          <Text style={styles.paragraph}>
            Studentsphere is designed to protect your personal thoughts, emotions, and journal entries. We take your data security seriously and use strong industry-standard protection throughout the app.
          </Text>

          <Text style={styles.subheading}>🔐 How Your Data Is Protected</Text>

          <View style={styles.listItem}>
            <Text style={styles.listIndex}>1. </Text>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Encrypted Journal Entries</Text>
              <Text style={styles.paragraph}>
                All your journal entries are encrypted before being stored in our database. We use Fernet (AES-based) encryption, which ensures that your entries cannot be read without the secret key.
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listIndex}>2. </Text>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Secure Storage</Text>
              <Text style={styles.paragraph}>
                Your encrypted data is stored safely in MongoDB Atlas, which also provides built-in encryption at rest for an additional layer of security.
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listIndex}>3. </Text>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Data in Transit Is Protected</Text>
              <Text style={styles.paragraph}>
                Whenever your data moves between your device and our servers, it is protected using HTTPS/TLS encryption so no one can intercept or view it.
              </Text>
            </View>
          </View>

          <Text style={styles.subheading}>🔑 How We Manage Keys</Text>
          <Text style={styles.paragraph}>
            Your encryption key is stored securely as a protected environment variable on our server platform. Only authorized services can access it — it is never exposed publicly or included in app files.
          </Text>

          <Text style={styles.subheading}>👤 Your Account Security</Text>
          <Text style={styles.listBullet}>• Password Protection</Text>
          <Text style={styles.paragraph}>
            All passwords are securely hashed before storing. We never save plain-text passwords.
          </Text>

          <Text style={styles.listBullet}>• Secure Login</Text>
          <Text style={styles.paragraph}>Your sessions are protected to prevent unauthorized access.</Text>

          <Text style={styles.subheading}>🛡️ What We Don’t Do</Text>
          <Text style={styles.paragraph}>❌ No selling or sharing your personal data</Text>
          <Text style={styles.paragraph}>❌ No advertising based on your journal content</Text>
          <Text style={styles.paragraph}>❌ No access to your entries unless required for technical operations</Text>
          <Text style={styles.paragraph}>❌ No storing unencrypted journal data</Text>

          <Text style={styles.subheading}>🧾 Your Control Over Your Data</Text>
          <Text style={styles.listBullet}>• Export Your Data</Text>
          <Text style={styles.paragraph}>You may request a copy of your journal data at any time.</Text>

          <Text style={styles.listBullet}>• Delete Your Account</Text>
          <Text style={styles.paragraph}>You can permanently delete your account and all your entries. Deleted data is removed from our servers.</Text>

          <Text style={styles.subheading}>Transparency & Trust</Text>
          <Text style={styles.paragraph}>
            We believe your thoughts are personal. Studentsphere will always be transparent about how your data is handled and will continue improving our security as we grow.
          </Text>


     

          {/* <Text style={styles.footer}>support@studentsphere.app</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#FBF8EF",
      },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
    marginTop: 30,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 20,
    fontFamily: "Gilroy-Bold",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 20,
    fontFamily: "Gilroy-Regular",
    textAlign:"justify"
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 20,
    fontFamily: "Gilroy-Bold",
  },
  listIndex: {
    fontSize: 14,
    fontWeight: '700',
    width: 20,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  listBullet: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    paddingHorizontal: 20,
    fontFamily: "Gilroy-Bold",
  },
  button: {
    marginTop: 14,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footer: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 180,
    backgroundColor: "#FBEEFC",
    paddingTop: 50,
  },
  headerTitle: {
    fontFamily: "Gilroy-Bold",
    fontSize: 22,
    marginLeft: 10,
  },
};
