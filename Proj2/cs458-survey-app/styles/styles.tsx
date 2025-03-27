import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    fontFamily: "Inter",
    maxWidth: 384,
    marginTop: 96,
    padding: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,

    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    minWidth: "90%",
    maxWidth: "90%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    fontSize: 16,
  },
  loginBtn: {
    fontFamily: "Inter",
    width: "100%",
    padding: 12,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: "#007bff",
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 24,
    fontSize: 14,
    color: "#777",
  },
  oauthContainer: {
    flexDirection: "row",
    gap: 12,
  },
  oauthButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  googleBtn: {
    backgroundColor: "#db4437",
  },
  facebookBtn: {
    backgroundColor: "#4267b2",
  },
});

export default styles;
