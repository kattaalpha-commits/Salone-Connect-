# Salone Connect Dating - ProGuard & R8 Code Shrinking / Obfuscation Rules
# Production Release Hardening Specification

# 1. Standard Android & Kotlin Rules
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# Optimization Passes
-optimizationpasses 5
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# 2. Preserve Essential Attributes for Crash Reporting & Security
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses,EnclosingMethod

# 3. Obfuscate All Internal Logic, Algorithms & Matching Engines
-repackageclasses 'com.saloneconnect.dating.internal'
-allowaccessmodification

# 4. Strip Diagnostic & Debug Logs from Release APK
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
}

# 5. Keep Data Model Serialization Classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !static !transient <methods>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 6. Biometric Liveness & Vision Security Preservation
-keep class com.saloneconnect.dating.security.** { *; }
-keep interface com.saloneconnect.dating.security.** { *; }

# 7. WebKit & WebView JavaScript Interface Protection
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 8. OkHttp & Retrofit SSL Pinning & TLS Rules
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
