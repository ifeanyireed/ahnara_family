import 'dart:async';
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:tabler_icons_next/tabler_icons_next.dart' as tabler;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ahnara Family',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0089C1),
          primary: const Color(0xFF0089C1),
          surface: const Color(0xFFE8EFF4),
        ),
        fontFamily: 'SF Pro Display',
        useMaterial3: true,
      ),
      home: const SplashPage(),
    );
  }
}

// ==========================================
// MODEL CLASSES
// ==========================================
class BirthPlanModel {
  String companionName;
  String companionRole;
  List<String> painManagement;
  List<String> environment;
  String backupHospital;
  String transportType;
  String bloodType;
  String donorName;
  String donorPhone;
  bool isLocked;
  String verificationStatus; // draft, pending, verified

  BirthPlanModel({
    required this.companionName,
    required this.companionRole,
    required this.painManagement,
    required this.environment,
    required this.backupHospital,
    required this.transportType,
    required this.bloodType,
    required this.donorName,
    required this.donorPhone,
    required this.isLocked,
    required this.verificationStatus,
  });

  BirthPlanModel copy() {
    return BirthPlanModel(
      companionName: companionName,
      companionRole: companionRole,
      painManagement: List.from(painManagement),
      environment: List.from(environment),
      backupHospital: backupHospital,
      transportType: transportType,
      bloodType: bloodType,
      donorName: donorName,
      donorPhone: donorPhone,
      isLocked: isLocked,
      verificationStatus: verificationStatus,
    );
  }
}

// ==========================================
// 1. SPLASH SCREEN WIDGET
// ==========================================
class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;
  late Animation<double> _textWidth;
  late Animation<Offset> _textOffset;
  late Animation<double> _textOpacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4500),
    );

    _logoScale = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.25, curve: Curves.easeOutBack),
      ),
    );

    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.2, curve: Curves.easeIn),
      ),
    );

    // Delay name sliding width animation by 3 seconds (3.0 / 4.5 = 0.666)
    _textWidth = Tween<double>(begin: 0.0, end: 122.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.666, 0.9, curve: Curves.easeInOutCubic),
      ),
    );

    _textOffset = Tween<Offset>(begin: const Offset(1.2, 0.0), end: Offset.zero).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.68, 0.93, curve: Curves.easeOutCubic),
      ),
    );

    _textOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.68, 0.9, curve: Curves.easeIn),
      ),
    );

    _controller.forward();

    // Route to Onboarding Page after 7.0 seconds
    Future.delayed(const Duration(milliseconds: 7000), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => const OnboardingPage(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFD4F475),
      body: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Centered Logo that translates left as width opens
                ScaleTransition(
                  scale: _logoScale,
                  child: FadeTransition(
                    opacity: _logoOpacity,
                    child: Image.asset(
                      'assets/logo.png',
                      width: 60,
                      height: 60,
                    ),
                  ),
                ),
                
                // Sliding width container that houses the sliding text
                SizedBox(
                  height: 60,
                  width: _textWidth.value,
                  child: ClipRect(
                    child: SlideTransition(
                      position: _textOffset,
                      child: FadeTransition(
                        opacity: _textOpacity,
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          physics: const NeverScrollableScrollPhysics(),
                          child: SizedBox(
                            width: 122,
                            child: Row(
                              children: [
                                const SizedBox(width: 8),
                                const Text(
                                  'Ahnara',
                                  style: TextStyle(
                                    fontSize: 34,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -1.5,
                                    color: Color(0xFF001C28),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

// ==========================================
// ONBOARDING PAGE (4-step feature highlighting)
// ==========================================
class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _onboardingData = [
    {
      'title': 'Pregnancy Timeline Explorer',
      'description': 'Track your gestation progress week-by-week with visual milestones, fruit size comparison models, and daily health metrics.',
      'icon': (Color color) => tabler.Clock(height: 110, width: 110, strokeWidth: 1.2, color: color),
      'iconColor': const Color(0xFF0089C1),
    },
    {
      'title': 'AI Midwife Advisor',
      'description': 'Access immediate symptom logging, triage warning flags, and direct midwife care support 24/7.',
      'icon': (Color color) => tabler.MessageChatbot(height: 110, width: 110, strokeWidth: 1.2, color: color),
      'iconColor': const Color(0xFFFF904C),
    },
    {
      'title': 'Digital Birth Plan',
      'description': 'Define and lock your labor preferences, companion support, safety backup hospitals, and transport options.',
      'icon': (Color color) => tabler.Calendar(height: 110, width: 110, strokeWidth: 1.2, color: color),
      'iconColor': const Color(0xFF608216),
    },
    {
      'title': 'NARA Partner Sync',
      'description': 'Link profiles instantly with a partner synchronization code. Keep family and carers informed automatically.',
      'icon': (Color color) => tabler.Qrcode(height: 110, width: 110, strokeWidth: 1.2, color: color),
      'iconColor': const Color(0xFF001C28),
    },
    {
      'title': 'AI Puberty Coach',
      'description': 'Discreet puberty guide maps, menstrual cycle predictions, acne checklists, and secure parent links.',
      'icon': (Color color) => tabler.MessageChatbot(height: 110, width: 110, strokeWidth: 1.2, color: color),
      'iconColor': const Color(0xFFE572A1),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFD4F475),
      body: Stack(
        children: [
          Positioned.fill(
            child: Center(
              child: Opacity(
                opacity: 0.05,
                child: Image.asset(
                  'assets/logo.png',
                  width: 360,
                  height: 360,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                // Top Header: Logo and App Name
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('assets/logo.png', width: 36, height: 36),
                      const SizedBox(width: 14),
                      const Text(
                        'Ahnara Family',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF001C28),
                          letterSpacing: -0.8,
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Onboarding Slides PageView
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (index) {
                      setState(() {
                        _currentPage = index;
                      });
                    },
                    itemCount: _onboardingData.length,
                    itemBuilder: (context, index) {
                      final item = _onboardingData[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Visual Icon directly on the green background with thin stroke width
                            (item['icon'] as Widget Function(Color))(item['iconColor'] as Color),
                            const SizedBox(height: 48),
                            
                            // Slide Title - Same color as the logo (Brand Blue)
                            Text(
                              item['title'] as String,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.5,
                                color: Color(0xFF001C28),
                              ),
                            ),
                            const SizedBox(height: 16),
                            
                            // Slide Description - Same color as the logo (Brand Blue, with slight opacity)
                            Text(
                              item['description'] as String,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF001C28).withOpacity(0.85),
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                
                // Bottom Bar: Dots indicator and navigation
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Indicators - Brand Blue indicators contrasting with green background
                      Row(
                        children: List.generate(
                          _onboardingData.length,
                          (index) => AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            margin: const EdgeInsets.only(right: 6),
                            height: 6,
                            width: _currentPage == index ? 18 : 6,
                            decoration: BoxDecoration(
                              color: _currentPage == index
                                  ? const Color(0xFF001C28)
                                  : const Color(0xFF001C28).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                      ),
                      
                      // Buttons
                      Row(
                        children: [
                          if (_currentPage < _onboardingData.length - 1) ...[
                            TextButton(
                              onPressed: () {
                                _pageController.jumpToPage(_onboardingData.length - 1);
                              },
                              child: const Text(
                                'Skip',
                                style: TextStyle(
                                  color: Color(0xFF001C28),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              onPressed: () {
                                _pageController.nextPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.easeInOut,
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF001C28),
                                foregroundColor: Colors.white,
                                shape: const StadiumBorder(),
                              ),
                              child: const Text('Next'),
                            ),
                          ] else ...[
                            ElevatedButton(
                              onPressed: () {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const MobileLoginPage(),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF001C28),
                                foregroundColor: Colors.white,
                                shape: const StadiumBorder(),
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                              ),
                              child: const Text(
                                'Get Started',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// AUTH SCREEN (Mama Portal Sign In)
// ==========================================
class MobileLoginPage extends StatefulWidget {
  const MobileLoginPage({super.key});

  @override
  State<MobileLoginPage> createState() => _MobileLoginPageState();
}

class _MobileLoginPageState extends State<MobileLoginPage> with SingleTickerProviderStateMixin {
  int _activeWorkspaceIndex = 0; // 0 = Mama, 1 = Kids, 2 = Seniors
  bool get _isKidsLogin => _activeWorkspaceIndex == 1;
  final TextEditingController _emailController = TextEditingController(text: "tyra@ahnara.com");
  final TextEditingController _passwordController = TextEditingController(text: "password123");
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _syncCodeController = TextEditingController();
  bool _obscureText = true;
  bool _isSignUp = false;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.9, curve: Curves.easeOut),
      ),
    );
    _slideAnimation = Tween<Offset>(begin: const Offset(0.0, 0.12), end: Offset.zero).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.9, curve: Curves.fastOutSlowIn),
      ),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE8EFF4),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(32.0),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                // Web-app branding container
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: Color(0xFFD4F475),
                    shape: BoxShape.circle,
                  ),
                  child: Image.asset('assets/logo.png', width: 44, height: 44),
                ),
                const SizedBox(height: 16),
                Text(
                  _isKidsLogin ? 'Ahnara Kids' : 'Ahnara Family',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.0,
                    color: Color(0xFF001C28),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _isSignUp 
                    ? (_activeWorkspaceIndex == 1 
                        ? 'Pediatric Care registration' 
                        : _activeWorkspaceIndex == 2 
                        ? 'Geriatric Care registration' 
                        : _activeWorkspaceIndex == 3 
                        ? 'Hormonal & Reproductive registration' 
                        : _activeWorkspaceIndex == 4 
                        ? 'Adolescent Care registration' 
                        : 'Maternal Care registration') 
                    : (_activeWorkspaceIndex == 1 
                        ? 'Pediatric Care login' 
                        : _activeWorkspaceIndex == 2 
                        ? 'Geriatric Care login' 
                        : _activeWorkspaceIndex == 3 
                        ? 'Hormonal & Reproductive login' 
                        : _activeWorkspaceIndex == 4 
                        ? 'Adolescent Care login' 
                        : 'Maternal Care login'),
                  style: TextStyle(
                    fontSize: 13,
                    color: const Color(0xFF001C28).withOpacity(0.5),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 32),

                // Workspace Toggle Tab
                Container(
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9).withOpacity(0.8),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
                  ),
                  padding: const EdgeInsets.all(4),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _activeWorkspaceIndex = 0),
                          child: Container(
                            decoration: BoxDecoration(
                              color: _activeWorkspaceIndex == 0 ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Maternal',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: _activeWorkspaceIndex == 0 ? Colors.white : const Color(0xFF001C28),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _activeWorkspaceIndex = 1),
                          child: Container(
                            decoration: BoxDecoration(
                              color: _activeWorkspaceIndex == 1 ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Pediatric',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: _activeWorkspaceIndex == 1 ? Colors.white : const Color(0xFF001C28),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _activeWorkspaceIndex = 2),
                          child: Container(
                            decoration: BoxDecoration(
                              color: _activeWorkspaceIndex == 2 ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Geriatric',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: _activeWorkspaceIndex == 2 ? Colors.white : const Color(0xFF001C28),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _activeWorkspaceIndex = 3),
                          child: Container(
                            decoration: BoxDecoration(
                              color: _activeWorkspaceIndex == 3 ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Lady',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: _activeWorkspaceIndex == 3 ? Colors.white : const Color(0xFF001C28),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _activeWorkspaceIndex = 4),
                          child: Container(
                            decoration: BoxDecoration(
                              color: _activeWorkspaceIndex == 4 ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Girlie',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: _activeWorkspaceIndex == 4 ? Colors.white : const Color(0xFF001C28),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Form Card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (_isSignUp) ...[
                        const Text(
                          'Full Name',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9).withOpacity(0.5),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          child: TextField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              hintText: 'e.g. Tyra Reed',
                              prefixIcon: Icon(Icons.person_outline, size: 16, color: Colors.grey),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                      ],

                      const Text(
                        'Email Address',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9).withOpacity(0.5),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: TextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'e.g. tyra@ahnara.com',
                            prefixIcon: Icon(Icons.email_outlined, size: 16, color: Colors.grey),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      const Text(
                        'Password',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9).withOpacity(0.5),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: TextField(
                          controller: _passwordController,
                          obscureText: _obscureText,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: '••••••••',
                            prefixIcon: const Icon(Icons.lock_outline, size: 16, color: Colors.grey),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                size: 16,
                                color: Colors.grey,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscureText = !_obscureText;
                                });
                              },
                            ),
                          ),
                        ),
                      ),
                      
                      if (_isSignUp) ...[
                        const SizedBox(height: 20),
                        const Text(
                          'Partner Sync Code (Optional)',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9).withOpacity(0.5),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          child: TextField(
                            controller: _syncCodeController,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              hintText: 'e.g. NARA-XYZ-789',
                              prefixIcon: Icon(Icons.qr_code_scanner, size: 16, color: Colors.grey),
                            ),
                          ),
                        ),
                      ],
                      
                      const SizedBox(height: 24),

                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: () {
                            if (_isSignUp) {
                              Navigator.pushReplacement(
                                context,
                                PageRouteBuilder(
                                  pageBuilder: (context, animation, secondaryAnimation) => OnboardingQuestionnairePage(
                                    workspaceIndex: _activeWorkspaceIndex,
                                    initialName: _nameController.text.trim(),
                                    initialEmail: _emailController.text.trim(),
                                  ),
                                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                                    return FadeTransition(opacity: animation, child: child);
                                  },
                                  transitionDuration: const Duration(milliseconds: 500),
                                ),
                              );
                            } else {
                              Navigator.pushReplacement(
                                context,
                                PageRouteBuilder(
                                  pageBuilder: (context, animation, secondaryAnimation) => DashboardPage(initialWorkspaceIndex: _activeWorkspaceIndex),
                                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                                    return FadeTransition(opacity: animation, child: child);
                                  },
                                  transitionDuration: const Duration(milliseconds: 500),
                                ),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF001C28),
                            foregroundColor: Colors.white,
                            shape: const StadiumBorder(),
                          ),
                          child: Text(
                            _isSignUp 
                              ? (_activeWorkspaceIndex == 1 
                                  ? 'Create Kids Account' 
                                  : _activeWorkspaceIndex == 2 
                                  ? 'Create Seniors Account' 
                                  : _activeWorkspaceIndex == 3 
                                  ? 'Create Lady Account' 
                                  : _activeWorkspaceIndex == 4 
                                  ? 'Create Girlie Account' 
                                  : 'Create Mama Account') 
                              : 'Sign In to Dashboard',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                
                // Toggle Sign In / Sign Up Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _isSignUp ? "Already have an account? " : "Don't have an account? ",
                      style: TextStyle(
                        fontSize: 12,
                        color: const Color(0xFF001C28).withOpacity(0.6),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _isSignUp = !_isSignUp;
                        });
                      },
                      child: Text(
                        _isSignUp ? "Sign In" : "Sign Up",
                        style: const TextStyle(
                          color: Color(0xFF0089C1),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Forgot/Register link
                TextButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Support ticket created!')),
                    );
                  },
                  child: const Text(
                    'Trouble logging in? Get support',
                    style: TextStyle(
                      color: Color(0xFF0089C1),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  ),
);
}
}

// ==========================================
// ONBOARDING QUESTIONNAIRE WIZARD (3-step)
// ==========================================
class OnboardingQuestionnairePage extends StatefulWidget {
  final int workspaceIndex;
  final String initialName;
  final String initialEmail;

  const OnboardingQuestionnairePage({
    super.key,
    required this.workspaceIndex,
    this.initialName = "",
    this.initialEmail = "",
  });

  @override
  State<OnboardingQuestionnairePage> createState() => _OnboardingQuestionnairePageState();
}

class _OnboardingQuestionnairePageState extends State<OnboardingQuestionnairePage> {
  int _currentStep = 1;

  // 1. Maternal Care (Mama) State Variables
  String _lmpDate = "${DateTime.now().subtract(const Duration(days: 84)).year}-${DateTime.now().subtract(const Duration(days: 84)).month.toString().padLeft(2, '0')}-${DateTime.now().subtract(const Duration(days: 84)).day.toString().padLeft(2, '0')}";
  String? _edd;
  int? _gestationWeeks;
  int? _gestationDays;
  int? _trimester;
  bool _underAgeOrOverAge = false;
  bool _hypertension = false;
  bool _diabetes = false;
  bool _previousPreeclampsia = false;
  bool _multiplePregnancy = false;
  String _maternalPartnerCode = "";
  bool _maternalIsSynced = false;

  // 2. Pediatric Care (Kids) State Variables
  late TextEditingController _childNameController;
  String _childDob = "${DateTime.now().subtract(const Duration(days: 90)).year}-${DateTime.now().subtract(const Duration(days: 90)).month.toString().padLeft(2, '0')}-${DateTime.now().subtract(const Duration(days: 90)).day.toString().padLeft(2, '0')}";
  String _biologicalSex = "Female";
  late TextEditingController _childWeightController;
  late TextEditingController _childLengthController;
  late TextEditingController _childHeadCircumferenceController;
  int _apgarHeartRate = 2;
  int _apgarRespiration = 2;
  int _apgarMuscleTone = 2;
  int _apgarReflexes = 2;
  int _apgarSkinColor = 2;
  late TextEditingController _mamaSyncIdController;
  String _pediatricPartnerCode = "";
  bool _pediatricPartnerSynced = false;
  bool _riskPreterm = false;
  bool _riskMultipleBirth = false;
  bool _riskMaternalComplication = false;
  bool _riskCongenitalChecks = false;

  // 3. Geriatric Care (Seniors) State Variables
  late TextEditingController _elderNameController;
  String _elderDob = "${DateTime.now().subtract(const Duration(days: 72 * 365)).year}-${DateTime.now().subtract(const Duration(days: 72 * 365)).month.toString().padLeft(2, '0')}-${DateTime.now().subtract(const Duration(days: 72 * 365)).day.toString().padLeft(2, '0')}";
  late TextEditingController _elderLangController;
  String _elderMobility = "independent";
  bool _aidHearing = false;
  bool _aidVisual = false;
  bool _aidMobility = false;
  bool _adlBathing = true;
  bool _adlDressing = true;
  bool _adlToileting = true;
  bool _adlTransferring = true;
  bool _adlFeeding = true;
  bool _adlContinence = true;
  bool _riskDementia = false;
  bool _riskCardiovascular = false;
  bool _riskDiabetes = false;
  bool _riskHypertension = false;
  bool _riskAllergies = false;
  String _elderPartnerCode = "";
  bool _elderIsSynced = false;
  bool _voiceConsentLogged = false;

  // 4. Lady Care (Lady) State Variables
  late TextEditingController _ladyNameController;
  String _ladyDob = "${DateTime.now().subtract(const Duration(days: 28 * 365)).year}-${DateTime.now().subtract(const Duration(days: 28 * 365)).month.toString().padLeft(2, '0')}-${DateTime.now().subtract(const Duration(days: 28 * 365)).day.toString().padLeft(2, '0')}";
  late TextEditingController _ladyCycleController;
  String _ladyContraception = "none";
  String _ladyLastPeriod = "${DateTime.now().subtract(const Duration(days: 14)).year}-${DateTime.now().subtract(const Duration(days: 14)).month.toString().padLeft(2, '0')}-${DateTime.now().subtract(const Duration(days: 14)).day.toString().padLeft(2, '0')}";
  String _ladyLastSmear = "${DateTime.now().subtract(const Duration(days: 365)).year}-${DateTime.now().subtract(const Duration(days: 365)).month.toString().padLeft(2, '0')}-${DateTime.now().subtract(const Duration(days: 365)).day.toString().padLeft(2, '0')}";
  String _ladyHpvDoses = "2";
  bool _symptomCramps = false;
  bool _symptomBloating = false;
  bool _symptomFatigue = false;
  bool _symptomBreakouts = false;
  bool _ladyVaultConsent = true;

  // 5. Adolescent Care (Girlie) State Variables
  late TextEditingController _girlieNameController;
  double _girlieAge = 14.0;
  bool _girlieFirstPeriod = true;
  bool _girlieHeightGrowth = true;
  bool _girliePinEnabled = true;
  late TextEditingController _girliePinController;
  late TextEditingController _girlieParentController;
  bool _girlieParentSynced = false;

  @override
  void initState() {
    super.initState();
    final name = widget.initialName.isNotEmpty ? widget.initialName : "";
    _childNameController = TextEditingController(text: name.isNotEmpty ? name : "Aria Dhillon");
    _childWeightController = TextEditingController(text: "3200");
    _childLengthController = TextEditingController(text: "50");
    _childHeadCircumferenceController = TextEditingController(text: "35");
    _mamaSyncIdController = TextEditingController(text: "MAMA-849-204");

    _elderNameController = TextEditingController(text: name.isNotEmpty ? name : "Margaret Dhillon");
    _elderLangController = TextEditingController(text: "English");

    _ladyNameController = TextEditingController(text: name.isNotEmpty ? name : "Clara Reed");
    _ladyCycleController = TextEditingController(text: "28");

    _girlieNameController = TextEditingController(text: name.isNotEmpty ? name : "Jane Doe");
    _girliePinController = TextEditingController(text: "4892");
    _girlieParentController = TextEditingController(text: "");

    // Generate codes
    final ms = DateTime.now().millisecond;
    final us = DateTime.now().microsecond;
    _maternalPartnerCode = "NARA-${100 + (ms % 900)}-${100 + (us % 900)}";
    _pediatricPartnerCode = "NARA-KIDS-${100 + (ms % 900)}-${100 + (us % 900)}";
    _elderPartnerCode = "NARA-SR-${100 + (ms % 900)}-${100 + (us % 900)}";

    _calculatePregnancyWeeks();
  }

  @override
  void dispose() {
    _childNameController.dispose();
    _childWeightController.dispose();
    _childLengthController.dispose();
    _childHeadCircumferenceController.dispose();
    _mamaSyncIdController.dispose();
    _elderNameController.dispose();
    _elderLangController.dispose();
    _ladyNameController.dispose();
    _ladyCycleController.dispose();
    _girlieNameController.dispose();
    _girliePinController.dispose();
    _girlieParentController.dispose();
    super.dispose();
  }

  void _calculatePregnancyWeeks() {
    if (_lmpDate.isEmpty) return;
    try {
      final lmp = DateTime.parse(_lmpDate);
      final today = DateTime.now();
      if (lmp.isAfter(today)) {
        setState(() {
          _edd = null;
          _gestationWeeks = null;
          _gestationDays = null;
          _trimester = null;
        });
        return;
      }
      final eddDate = lmp.add(const Duration(days: 280));
      final monthsList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      setState(() {
        _edd = "${monthsList[eddDate.month - 1]} ${eddDate.day}, ${eddDate.year}";
        final diffDays = today.difference(lmp).inDays;
        _gestationWeeks = diffDays ~/ 7;
        _gestationDays = diffDays % 7;
        
        if (_gestationWeeks! < 13) {
          _trimester = 1;
        } else if (_gestationWeeks! < 27) {
          _trimester = 2;
        } else {
          _trimester = 3;
        }
      });
    } catch (_) {}
  }

  Map<String, String> _getBabySizeInfo(int weeks) {
    if (weeks < 4) return { 'size': "Poppy Seed", 'desc': "Your baby is just starting to take shape as an embryo.", 'icon': "🌱" };
    if (weeks < 7) return { 'size': "Sweet Pea", 'desc': "Baby's heart is beating and tiny arm buds are growing.", 'icon': "🍃" };
    if (weeks < 9) return { 'size': "Raspberry", 'desc': "Hands and feet are forming, and little nose/lips are appearing.", 'icon': "🍒" };
    if (weeks < 13) return { 'size': "Lime", 'desc': "Baby's organs are fully formed and muscles are starting to twitch.", 'icon': "🍋" };
    if (weeks < 17) return { 'size': "Avocado", 'desc': "Eyes can move, and your baby is starting to grow fine hair (lanugo).", 'icon': "🥑" };
    if (weeks < 21) return { 'size': "Banana", 'desc': "Your baby can swallow and is very active. Kick counts are near!", 'icon': "🍌" };
    if (weeks < 25) return { 'size': "Cantaloupe", 'desc': "Inner ear is fully developed, and baby can hear your voice and heartbeat.", 'icon': "🍈" };
    if (weeks < 29) return { 'size': "Eggplant", 'desc': "Lungs are developing rapidly, and baby can open and close their eyes.", 'icon': "🍆" };
    if (weeks < 33) return { 'size': "Pineapple", 'desc': "Bones are fully developed, and baby is gaining fat underneath their skin.", 'icon': "🍍" };
    if (weeks < 37) return { 'size': "Papaya", 'desc': "Organs are matured enough to function outside, and baby is dropping lower.", 'icon': "🥭" };
    return { 'size': "Watermelon", 'desc': "Your baby is fully grown and ready to meet you! Happy due date month.", 'icon': "🍉" };
  }

  Color _getWorkspaceColor() {
    switch (widget.workspaceIndex) {
      case 0: return const Color(0xFF8BB436);
      case 1: return const Color(0xFF0089C1);
      case 2: return const Color(0xFF6366F1);
      case 3: return const Color(0xFFE11D48);
      case 4: return const Color(0xFFE572A1);
      default: return const Color(0xFF001C28);
    }
  }

  String _getWorkspaceName() {
    switch (widget.workspaceIndex) {
      case 0: return "Maternal Care";
      case 1: return "Pediatric Care";
      case 2: return "Geriatric Care";
      case 3: return "Lady Care";
      case 4: return "Adolescent Care";
      default: return "Care Workspace";
    }
  }

  String _getStepTitle() {
    if (widget.workspaceIndex == 0) {
      if (_currentStep == 1) return "Calculate Gestation Week";
      if (_currentStep == 2) return "Health Pre-Checklist";
      return "Sync with Partner / Midwife";
    } else if (widget.workspaceIndex == 1) {
      if (_currentStep == 1) return "Register Newborn or Child";
      if (_currentStep == 2) return "Birth Metrics & APGAR";
      return "Sync & Pre-Screening Risks";
    } else if (widget.workspaceIndex == 2) {
      if (_currentStep == 1) return "Geriatric Setup";
      if (_currentStep == 2) return "ADL & Critical Risks";
      return "Care Sync";
    } else if (widget.workspaceIndex == 3) {
      if (_currentStep == 1) return "Lady Profile";
      if (_currentStep == 2) return "Preventative Screenings";
      return "Clinical Vault Consent";
    } else {
      if (_currentStep == 1) return "Adolescent Profile & Age";
      if (_currentStep == 2) return "Privacy & Local Lock";
      return "Parent Account Circle Sync";
    }
  }

  String _getStepDescription() {
    if (widget.workspaceIndex == 0) {
      if (_currentStep == 1) return "Select the first day of your Last Menstrual Period (LMP) to configure your pregnancy timeline.";
      if (_currentStep == 2) return "Select any pre-existing health factors to personalize your clinical alerts and midwives dashboard triggers.";
      return "Connect your timelines and SOS tracking with your partner, family companion, or clinic nurse using NARA Link.";
    } else if (widget.workspaceIndex == 1) {
      if (_currentStep == 1) return "Enter basic identity details for the child to establish appropriate developmental age-bands.";
      if (_currentStep == 2) return "Input birth measurements to track percentiles and calculate baby's immediate physiological status.";
      return "Sync newborn files with the mother's antenatal records and identify checkups indicators.";
    } else if (widget.workspaceIndex == 2) {
      if (_currentStep == 1) return "Set up a profile for an elder user or aging parent.";
      if (_currentStep == 2) return "Complete activities of daily living index and check medical flags.";
      return "Manage emergency notification lists and voice checking consent protocols.";
    } else if (widget.workspaceIndex == 3) {
      if (_currentStep == 1) return "Provide cycle details to construct hormone predictions.";
      if (_currentStep == 2) return "Enter your recent cervical smears and active symptoms.";
      return "Manage privacy parameters and encryption options.";
    } else {
      if (_currentStep == 1) return "Provide basic detail parameters to customize educational guidance.";
      if (_currentStep == 2) return "Set up secure passcode protections for your private logs.";
      return "Optionally link parent accounts to forward supply request tickets.";
    }
  }

  Future<void> _selectDate(BuildContext context, String currentVal, Function(String) onSelected) async {
    DateTime initial = DateTime.tryParse(currentVal) ?? DateTime.now();
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(1900),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: _getWorkspaceColor(),
              onPrimary: Colors.white,
              onSurface: const Color(0xFF001C28),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      onSelected("${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}");
    }
  }

  void _completeOnboarding() {
    Map<String, dynamic> data = {};
    if (widget.workspaceIndex == 0) {
      data = {
        'gestationWeeks': _gestationWeeks,
        'gestationDays': _gestationDays,
        'trimester': _trimester,
        'edd': _edd,
        'lmpDate': _lmpDate,
        'maternalRisks': {
          'underAgeOrOverAge': _underAgeOrOverAge,
          'hypertension': _hypertension,
          'diabetes': _diabetes,
          'previousPreeclampsia': _previousPreeclampsia,
          'multiplePregnancy': _multiplePregnancy,
        },
        'maternalPartnerCode': _maternalPartnerCode,
        'maternalIsSynced': _maternalIsSynced,
      };
    } else if (widget.workspaceIndex == 1) {
      data = {
        'childName': _childNameController.text.trim(),
        'childDob': _childDob,
        'biologicalSex': _biologicalSex,
        'childWeight': _childWeightController.text.trim(),
        'childLength': _childLengthController.text.trim(),
        'childHeadCircumference': _childHeadCircumferenceController.text.trim(),
        'apgarScore': _apgarHeartRate + _apgarRespiration + _apgarMuscleTone + _apgarReflexes + _apgarSkinColor,
        'mamaRecordSync': _mamaSyncIdController.text.trim(),
        'pediatricPartnerCode': _pediatricPartnerCode,
        'pediatricPartnerSynced': _pediatricPartnerSynced,
        'pediatricRisks': {
          'preterm': _riskPreterm,
          'multipleBirth': _riskMultipleBirth,
          'maternalComplication': _riskMaternalComplication,
          'congenitalChecks': _riskCongenitalChecks,
        },
      };
    } else if (widget.workspaceIndex == 2) {
      data = {
        'elderName': _elderNameController.text.trim(),
        'elderDob': _elderDob,
        'elderLanguage': _elderLangController.text.trim(),
        'elderMobility': _elderMobility,
        'adlChecks': {
          'bathing': _adlBathing,
          'dressing': _adlDressing,
          'toileting': _adlToileting,
          'transferring': _adlTransferring,
          'feeding': _adlFeeding,
          'continence': _adlContinence,
        },
        'elderRisks': {
          'dementia': _riskDementia,
          'cardiovascular': _riskCardiovascular,
          'diabetes': _riskDiabetes,
          'hypertension': _riskHypertension,
          'allergies': _riskAllergies,
        },
        'elderPartnerCode': _elderPartnerCode,
        'elderIsSynced': _elderIsSynced,
        'voiceConsentLogged': _voiceConsentLogged,
      };
    } else if (widget.workspaceIndex == 3) {
      data = {
        'ladyName': _ladyNameController.text.trim(),
        'ladyDob': _ladyDob,
        'ladyCycleLength': _ladyCycleController.text.trim(),
        'ladyContraception': _ladyContraception,
        'ladyLastPeriod': _ladyLastPeriod,
        'ladyLastSmear': _ladyLastSmear,
        'ladyHpvDoses': _ladyHpvDoses,
        'ladySymptoms': {
          'cramps': _symptomCramps,
          'bloating': _symptomBloating,
          'fatigue': _symptomFatigue,
          'breakouts': _symptomBreakouts,
        },
        'ladyVaultConsent': _ladyVaultConsent,
      };
    } else if (widget.workspaceIndex == 4) {
      data = {
        'girlieName': _girlieNameController.text.trim(),
        'girlieAge': _girlieAge,
        'girlieFirstPeriod': _girlieFirstPeriod,
        'girlieHeightGrowth': _girlieHeightGrowth,
        'girliePinEnabled': _girliePinEnabled,
        'girliePinCode': _girliePinController.text.trim(),
        'girlieParentCode': _girlieParentController.text.trim(),
        'girlieParentSynced': _girlieParentSynced,
      };
    }

    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => DashboardPage(
          initialWorkspaceIndex: widget.workspaceIndex,
          onboardingData: data,
        ),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  Widget _buildStepIndicator() {
    final accent = _getWorkspaceColor();
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        for (int i = 1; i <= 3; i++) ...[
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: _currentStep == i
                  ? accent
                  : _currentStep > i
                      ? accent.withOpacity(0.2)
                      : Colors.white,
              shape: BoxShape.circle,
              border: Border.all(
                color: _currentStep >= i ? accent : Colors.grey.shade300,
                width: 2,
              ),
            ),
            alignment: Alignment.center,
            child: _currentStep > i
                ? Icon(Icons.check, size: 16, color: accent)
                : Text(
                    "$i",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: _currentStep == i
                          ? Colors.white
                          : Colors.grey.shade600,
                    ),
                  ),
          ),
          if (i < 3)
            Container(
              width: 48,
              height: 2,
              color: _currentStep > i ? accent : Colors.grey.shade300,
            ),
        ]
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    IconData? prefixIcon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
        ),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9).withOpacity(0.5),
            borderRadius: BorderRadius.circular(14),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: hint,
              hintStyle: const TextStyle(fontSize: 13, color: Colors.grey),
              prefixIcon: prefixIcon != null ? Icon(prefixIcon, size: 16, color: Colors.grey) : null,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCheckToggle(String label, bool active, Color activeColor, Function(bool) onToggle) {
    return GestureDetector(
      onTap: () => onToggle(!active),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: active ? activeColor.withOpacity(0.08) : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: active ? activeColor.withOpacity(0.3) : Colors.grey.shade200),
        ),
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                color: active ? activeColor : Colors.white,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: active ? activeColor : Colors.grey.shade300),
              ),
              alignment: Alignment.center,
              child: active ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: active ? activeColor : const Color(0xFF001C28),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildDateTile(String label, String dateStr, Function() onTap) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
        ),
        const SizedBox(height: 6),
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9).withOpacity(0.5),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  dateStr,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                ),
                Icon(Icons.calendar_today, size: 16, color: _getWorkspaceColor()),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // APGAR status check
  Map<String, dynamic> _getApgarCategory(int score) {
    if (score >= 7) {
      return {
        'text': "Normal / Excellent Status",
        'color': const Color(0xFF608216),
        'bg': const Color(0xFFE8F3CE),
        'border': const Color(0xFFCDE0A4)
      };
    } else if (score >= 4) {
      return {
        'text': "Moderately Depressed (Needs Support)",
        'color': Colors.orange.shade900,
        'bg': Colors.orange.shade50,
        'border': Colors.orange.shade200
      };
    } else {
      return {
        'text': "Severely Depressed (Emergency Alert)",
        'color': Colors.red.shade900,
        'bg': Colors.red.shade50,
        'border': Colors.red.shade200
      };
    }
  }

  bool _hasAnyPediatricRisk() {
    final weightVal = int.tryParse(_childWeightController.text) ?? 3200;
    final apgarScore = _apgarHeartRate + _apgarRespiration + _apgarMuscleTone + _apgarReflexes + _apgarSkinColor;
    return _riskPreterm || _riskMultipleBirth || _riskMaternalComplication || _riskCongenitalChecks || (weightVal < 2500) || (apgarScore < 7);
  }

  @override
  Widget build(BuildContext context) {
    final accent = _getWorkspaceColor();
    final workspaceName = _getWorkspaceName();

    return Scaffold(
      backgroundColor: const Color(0xFFE8EFF4),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('assets/logo.png', width: 30, height: 30),
                  const SizedBox(width: 10),
                  Text(
                    'Ahnara $workspaceName',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF001C28),
                      letterSpacing: -0.6,
                    ),
                  ),
                ],
              ),
            ),

            // Stepper progress indicator
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
              child: _buildStepIndicator(),
            ),

            const SizedBox(height: 16),

            // Main wizard card
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Step Title & Description
                    Text(
                      _getStepTitle(),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF001C28),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _getStepDescription(),
                      style: TextStyle(
                        fontSize: 12,
                        color: const Color(0xFF001C28).withOpacity(0.6),
                        fontWeight: FontWeight.bold,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Step form fields
                    Expanded(
                      child: SingleChildScrollView(
                        physics: const BouncingScrollPhysics(),
                        child: _buildStepContent(),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Navigation Buttons Bottom Bar
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back Button
                  if (_currentStep > 1)
                    OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _currentStep--;
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        shape: const StadiumBorder(),
                        side: BorderSide(color: accent),
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.chevron_left, size: 16, color: accent),
                          const SizedBox(width: 4),
                          Text("Back", style: TextStyle(fontWeight: FontWeight.bold, color: accent)),
                        ],
                      ),
                    )
                  else
                    const SizedBox.shrink(),

                  // Next / Complete Button
                  ElevatedButton(
                    onPressed: () {
                      if (_currentStep < 3) {
                        setState(() {
                          _currentStep++;
                        });
                      } else {
                        _completeOnboarding();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: accent,
                      foregroundColor: Colors.white,
                      shape: const StadiumBorder(),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    ),
                    child: Row(
                      children: [
                        Text(
                          _currentStep == 3 ? "Complete Onboarding" : "Next",
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 4),
                        Icon(_currentStep == 3 ? Icons.check : Icons.chevron_right, size: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    final accent = _getWorkspaceColor();

    // ========================================================
    // 0. MATERNAL CARE (MAMA)
    // ========================================================
    if (widget.workspaceIndex == 0) {
      if (_currentStep == 1) {
        return Column(
          children: [
            _buildDateTile("Last Menstrual Period (LMP)", _lmpDate, () {
              _selectDate(context, _lmpDate, (val) {
                setState(() {
                  _lmpDate = val;
                });
                _calculatePregnancyWeeks();
              });
            }),
            if (_gestationWeeks != null && _gestationWeeks! >= 0 && _gestationWeeks! <= 42) ...[
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F3CE),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFCDE0A4)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("GESTATIONAL AGE", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF608216))),
                          const SizedBox(height: 4),
                          Text("Week $_gestationWeeks (${_gestationDays} Days)", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF001C28))),
                          const SizedBox(height: 4),
                          Text("Trimester $_trimester", style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF608216))),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("EXPECTED DUE DATE (EDD)", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                          const SizedBox(height: 4),
                          Text(_edd ?? "N/A", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF001C28))),
                          const SizedBox(height: 4),
                          const Text("280 days calculation", style: TextStyle(fontSize: 9, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              (() {
                final info = _getBabySizeInfo(_gestationWeeks!);
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDDEEF3),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF0089C1).withOpacity(0.1)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text(info['icon'] ?? "🌱", style: const TextStyle(fontSize: 24)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("Baby is the size of a ${info['size']}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                            const SizedBox(height: 2),
                            Text(info['desc'] ?? "", style: TextStyle(fontSize: 10, color: Colors.grey.shade700, height: 1.3)),
                          ],
                        ),
                      )
                    ],
                  ),
                );
              })(),
            ] else if (_lmpDate.isNotEmpty) ...[
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.red.shade100),
                ),
                child: Row(
                  children: [
                    Icon(TablerIcons.alert_triangle, color: Colors.red.shade700, size: 20),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Text(
                        "LMP date cannot be in the future or exceed 42 weeks ago.",
                        style: TextStyle(fontSize: 11, color: Colors.red, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ]
          ],
        );
      } else if (_currentStep == 2) {
        final isHighRisk = _underAgeOrOverAge || _hypertension || _diabetes || _previousPreeclampsia || _multiplePregnancy;
        return Column(
          children: [
            _buildCheckToggle("Maternal age is under 18 or over 35", _underAgeOrOverAge, accent, (v) => setState(() => _underAgeOrOverAge = v)),
            _buildCheckToggle("Pre-existing high blood pressure (hypertension)", _hypertension, accent, (v) => setState(() => _hypertension = v)),
            _buildCheckToggle("Pre-existing diabetes or high blood sugar", _diabetes, accent, (v) => setState(() => _diabetes = v)),
            _buildCheckToggle("History of pre-eclampsia in previous pregnancy", _previousPreeclampsia, accent, (v) => setState(() => _previousPreeclampsia = v)),
            _buildCheckToggle("Expecting twins, triplets or multiple babies", _multiplePregnancy, accent, (v) => setState(() => _multiplePregnancy = v)),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isHighRisk ? const Color(0xFFFFF7ED) : const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isHighRisk ? const Color(0xFFFFE4E6) : const Color(0xFFD1FAE5)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    isHighRisk ? TablerIcons.alert_triangle : TablerIcons.shield,
                    color: isHighRisk ? Colors.orange.shade700 : Colors.green.shade700,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isHighRisk ? "High Risk Assessment Flags" : "Standard Care Protocol Assessed",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isHighRisk ? Colors.orange.shade900 : Colors.green.shade900,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          isHighRisk
                              ? "We will highlight these factors for your clinic midwife. Rest assured, this helps customize your care plan for a safe delivery."
                              : "No initial clinical risk indicators flags checked. You are set for standard antenatal care schedules!",
                          style: TextStyle(
                            fontSize: 10,
                            color: isHighRisk ? Colors.orange.shade800 : Colors.green.shade800,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          ],
        );
      } else {
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(TablerIcons.qrcode, size: 40, color: Color(0xFF0089C1)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("SYNC ACTIVATION CODE", style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey)),
                        const SizedBox(height: 2),
                        Text(
                          _maternalPartnerCode,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF001C28), fontFamily: 'Courier'),
                        ),
                        const SizedBox(height: 6),
                        GestureDetector(
                          onTap: () => setState(() => _maternalIsSynced = !_maternalIsSynced),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: _maternalIsSynced ? const Color(0xFFD1FAE5) : Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: _maternalIsSynced ? Colors.green.shade200 : Colors.grey.shade300),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (_maternalIsSynced) const Icon(Icons.check, size: 12, color: Colors.green),
                                if (_maternalIsSynced) const SizedBox(width: 4),
                                Text(
                                  _maternalIsSynced ? "Connected" : "Mark as Synced (Simulate)",
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: _maternalIsSynced ? Colors.green.shade800 : Colors.grey.shade700),
                                ),
                              ],
                            ),
                          ),
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFDDEEF3),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                "Share this code or scan QR to automatically receive your kick counts, vitals updates, and GPS dispatch during SOS emergencies.",
                style: TextStyle(fontSize: 10, color: Color(0xFF0089C1), height: 1.3),
              ),
            )
          ],
        );
      }
    }

    // ========================================================
    // 1. PEDIATRIC CARE (KIDS)
    // ========================================================
    if (widget.workspaceIndex == 1) {
      if (_currentStep == 1) {
        return Column(
          children: [
            _buildTextField(controller: _childNameController, label: "CHILD'S FULL NAME", hint: "e.g. Aria Dhillon", prefixIcon: Icons.person),
            const SizedBox(height: 16),
            _buildDateTile("DATE OF BIRTH", _childDob, () {
              _selectDate(context, _childDob, (val) {
                setState(() {
                  _childDob = val;
                });
              });
            }),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("BIOLOGICAL SEX", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _biologicalSex = "Male"),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: _biologicalSex == "Male" ? const Color(0xFF001C28) : Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: _biologicalSex == "Male" ? const Color(0xFF001C28) : Colors.grey.shade300),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            "Male",
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: _biologicalSex == "Male" ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _biologicalSex = "Female"),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: _biologicalSex == "Female" ? const Color(0xFF001C28) : Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: _biologicalSex == "Female" ? const Color(0xFF001C28) : Colors.grey.shade300),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            "Female",
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: _biologicalSex == "Female" ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFDDEEF3),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                "Entering correct demographic details automatically maps vaccination dates against the standard pediatric schedules (EPI calendar).",
                style: TextStyle(fontSize: 10, color: Color(0xFF0089C1), height: 1.3),
              ),
            )
          ],
        );
      } else if (_currentStep == 2) {
        final score = _apgarHeartRate + _apgarRespiration + _apgarMuscleTone + _apgarReflexes + _apgarSkinColor;
        final apgarCat = _getApgarCategory(score);
        return Column(
          children: [
            Row(
              children: [
                Expanded(child: _buildTextField(controller: _childWeightController, label: "WEIGHT (GRAMS)", hint: "e.g. 3200", keyboardType: TextInputType.number)),
                const SizedBox(width: 10),
                Expanded(child: _buildTextField(controller: _childLengthController, label: "LENGTH (CM)", hint: "e.g. 50", keyboardType: TextInputType.number)),
                const SizedBox(width: 10),
                Expanded(child: _buildTextField(controller: _childHeadCircumferenceController, label: "HEAD CIRCUM. (CM)", hint: "e.g. 35", keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("APGAR CALCULATOR", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: apgarCat['bg'],
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: apgarCat['border']),
                        ),
                        child: Text(
                          "SCORE: $score / 10",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: apgarCat['color']),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildDropdownRow(
                    label: "1. Heart Rate (Pulse)",
                    value: _apgarHeartRate,
                    items: [
                      const DropdownMenuItem(value: 0, child: Text("0 — Absent (No pulse)", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 1, child: Text("1 — Under 100 beats/min", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 2, child: Text("2 — Over 100 beats/min", style: TextStyle(fontSize: 11))),
                    ],
                    onChanged: (val) => setState(() => _apgarHeartRate = val ?? 2),
                  ),
                  _buildDropdownRow(
                    label: "2. Respiration (Effort)",
                    value: _apgarRespiration,
                    items: [
                      const DropdownMenuItem(value: 0, child: Text("0 — Absent (No cry)", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 1, child: Text("1 — Slow, irregular cry", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 2, child: Text("2 — Good crying, normal", style: TextStyle(fontSize: 11))),
                    ],
                    onChanged: (val) => setState(() => _apgarRespiration = val ?? 2),
                  ),
                  _buildDropdownRow(
                    label: "3. Muscle Tone (Activity)",
                    value: _apgarMuscleTone,
                    items: [
                      const DropdownMenuItem(value: 0, child: Text("0 — Flaccid, limp muscles", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 1, child: Text("1 — Some flexion of limbs", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 2, child: Text("2 — Active motion, flexed", style: TextStyle(fontSize: 11))),
                    ],
                    onChanged: (val) => setState(() => _apgarMuscleTone = val ?? 2),
                  ),
                  _buildDropdownRow(
                    label: "4. Reflexes (Grimace)",
                    value: _apgarReflexes,
                    items: [
                      const DropdownMenuItem(value: 0, child: Text("0 — No response to stimuli", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 1, child: Text("1 — Grimace on stimulation", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 2, child: Text("2 — Active mouth cough/cry", style: TextStyle(fontSize: 11))),
                    ],
                    onChanged: (val) => setState(() => _apgarReflexes = val ?? 2),
                  ),
                  _buildDropdownRow(
                    label: "5. Skin Color (Appearance)",
                    value: _apgarSkinColor,
                    items: [
                      const DropdownMenuItem(value: 0, child: Text("0 — Cyanosis (Entirely blue/pale)", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 1, child: Text("1 — Acrocyanosis (Blue limbs)", style: TextStyle(fontSize: 11))),
                      const DropdownMenuItem(value: 2, child: Text("2 — Normal (Completely pink)", style: TextStyle(fontSize: 11))),
                    ],
                    onChanged: (val) => setState(() => _apgarSkinColor = val ?? 2),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: apgarCat['bg'],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: apgarCat['border']),
                    ),
                    child: Text(
                      "Assessment Category: ${apgarCat['text']}",
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: apgarCat['color']),
                    ),
                  )
                ],
              ),
            )
          ],
        );
      } else {
        final isRisk = _hasAnyPediatricRisk();
        return Column(
          children: [
            _buildTextField(controller: _mamaSyncIdController, label: "ANTENATAL MAMA SYNC ID", hint: "e.g. MAMA-849-204", prefixIcon: TablerIcons.qrcode),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("NEWBORN PRE-SCREENING CHECKLIST", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 8),
                _buildCheckToggle("Preterm delivery (born before 37 weeks)", _riskPreterm, accent, (v) => setState(() => _riskPreterm = v)),
                _buildCheckToggle("Multiple pregnancy birth (twins, triplets)", _riskMultipleBirth, accent, (v) => setState(() => _riskMultipleBirth = v)),
                _buildCheckToggle("Mother experienced pre-eclampsia", _riskMaternalComplication, accent, (v) => setState(() => _riskMaternalComplication = v)),
                _buildCheckToggle("Doctor advised vital organ follow-up", _riskCongenitalChecks, accent, (v) => setState(() => _riskCongenitalChecks = v)),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isRisk ? const Color(0xFFFFF7ED) : const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isRisk ? const Color(0xFFFFE4E6) : const Color(0xFFD1FAE5)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    isRisk ? TablerIcons.alert_triangle : TablerIcons.shield,
                    color: isRisk ? Colors.orange.shade700 : Colors.green.shade700,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isRisk ? "Higher Risk Assessment Flags" : "Optimal Development Mapped",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isRisk ? Colors.orange.shade900 : Colors.green.shade900,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          isRisk
                              ? "We found indicators (low APGAR, birth weight under 2500g, or preterm checks). Standard clinic schedules will be highlighted with pediatrician consult guidelines."
                              : "Child baseline metrics are within optimal parameters. Safe standard immunization reminders and growth percentiles are configured.",
                          style: TextStyle(
                            fontSize: 10,
                            color: isRisk ? Colors.orange.shade800 : Colors.green.shade800,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          ],
        );
      }
    }

    // ========================================================
    // 2. GERIATRIC CARE (SENIORS)
    // ========================================================
    if (widget.workspaceIndex == 2) {
      if (_currentStep == 1) {
        return Column(
          children: [
            _buildTextField(controller: _elderNameController, label: "ELDER'S FULL NAME", hint: "e.g. Margaret Dhillon", prefixIcon: Icons.person),
            const SizedBox(height: 16),
            _buildDateTile("DATE OF BIRTH", _elderDob, () {
              _selectDate(context, _elderDob, (val) {
                setState(() {
                  _elderDob = val;
                });
              });
            }),
            const SizedBox(height: 16),
            _buildTextField(controller: _elderLangController, label: "PRIMARY LANGUAGE", hint: "e.g. English, Spanish", prefixIcon: Icons.calendar_today),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("MOBILITY BASELINE LEVEL", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    _buildMobilityBtn("independent", "Independent"),
                    const SizedBox(width: 8),
                    _buildMobilityBtn("assisted", "Assisted"),
                    const SizedBox(width: 8),
                    _buildMobilityBtn("wheelchair", "Wheelchair"),
                  ],
                )
              ],
            ),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("SENSORY / MOBILITY AIDS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: _buildCheckToggle("Hearing Aid", _aidHearing, accent, (v) => setState(() => _aidHearing = v))),
                    const SizedBox(width: 8),
                    Expanded(child: _buildCheckToggle("Glasses", _aidVisual, accent, (v) => setState(() => _aidVisual = v))),
                    const SizedBox(width: 8),
                    Expanded(child: _buildCheckToggle("Cane/Walker", _aidMobility, accent, (v) => setState(() => _aidMobility = v))),
                  ],
                ),
              ],
            )
          ],
        );
      } else if (_currentStep == 2) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("ACTIVITIES OF DAILY LIVING (ADL) INDEX", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
            const SizedBox(height: 8),
            _buildCheckToggle("Bathing Self", _adlBathing, Colors.green, (v) => setState(() => _adlBathing = v)),
            _buildCheckToggle("Dressing Self", _adlDressing, Colors.green, (v) => setState(() => _adlDressing = v)),
            _buildCheckToggle("Toileting Help", _adlToileting, Colors.green, (v) => setState(() => _adlToileting = v)),
            _buildCheckToggle("Moving / Transferring", _adlTransferring, Colors.green, (v) => setState(() => _adlTransferring = v)),
            _buildCheckToggle("Feeding Self", _adlFeeding, Colors.green, (v) => setState(() => _adlFeeding = v)),
            _buildCheckToggle("Continence Control", _adlContinence, Colors.green, (v) => setState(() => _adlContinence = v)),
            const SizedBox(height: 16),
            const Text("CRITICAL DIAGNOSTIC FLAGS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
            const SizedBox(height: 8),
            _buildCheckToggle("Cognitive / Dementia history", _riskDementia, accent, (v) => setState(() => _riskDementia = v)),
            _buildCheckToggle("Cardiovascular History", _riskCardiovascular, accent, (v) => setState(() => _riskCardiovascular = v)),
            _buildCheckToggle("Diabetes", _riskDiabetes, accent, (v) => setState(() => _riskDiabetes = v)),
            _buildCheckToggle("Hypertension (High BP)", _riskHypertension, accent, (v) => setState(() => _riskHypertension = v)),
            _buildCheckToggle("Critical Medication Allergies", _riskAllergies, accent, (v) => setState(() => _riskAllergies = v)),
          ],
        );
      } else {
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(TablerIcons.qrcode, size: 40, color: Color(0xFF6366F1)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("CAREGIVER ACTIVATION CODE", style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey)),
                        const SizedBox(height: 2),
                        Text(
                          _elderPartnerCode,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF6366F1), fontFamily: 'Courier'),
                        ),
                        const SizedBox(height: 6),
                        GestureDetector(
                          onTap: () => setState(() => _elderIsSynced = !_elderIsSynced),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: _elderIsSynced ? const Color(0xFFD1FAE5) : Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: _elderIsSynced ? Colors.green.shade200 : Colors.grey.shade300),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (_elderIsSynced) const Icon(Icons.check, size: 12, color: Colors.green),
                                if (_elderIsSynced) const SizedBox(width: 4),
                                Text(
                                  _elderIsSynced ? "Care Connected" : "Mark as Linked",
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: _elderIsSynced ? Colors.green.shade800 : Colors.grey.shade700),
                                ),
                              ],
                            ),
                          ),
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.indigo.shade50.withOpacity(0.4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.indigo.shade100),
              ),
              child: Row(
                children: [
                  Switch(
                    value: _voiceConsentLogged,
                    activeColor: accent,
                    onChanged: (val) => setState(() => _voiceConsentLogged = val),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      "I consent to enable Voice Signature check-ins for diagnostic assessment verification.",
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                    ),
                  )
                ],
              ),
            )
          ],
        );
      }
    }

    // ========================================================
    // 3. LADY CARE (LADY)
    // ========================================================
    if (widget.workspaceIndex == 3) {
      if (_currentStep == 1) {
        return Column(
          children: [
            _buildTextField(controller: _ladyNameController, label: "MY FULL NAME", hint: "e.g. Clara Reed", prefixIcon: Icons.person),
            const SizedBox(height: 16),
            _buildDateTile("DATE OF BIRTH", _ladyDob, () {
              _selectDate(context, _ladyDob, (val) {
                setState(() {
                  _ladyDob = val;
                });
              });
            }),
            const SizedBox(height: 16),
            _buildTextField(controller: _ladyCycleController, label: "AVERAGE CYCLE LENGTH (DAYS)", hint: "e.g. 28", keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("CONTRACEPTIVE METHOD", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9).withOpacity(0.5),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _ladyContraception,
                      isExpanded: true,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                      items: const [
                        DropdownMenuItem(value: "none", child: Text("None / Cycle Awareness")),
                        DropdownMenuItem(value: "pill-combo", child: Text("Combination Oral Pill")),
                        DropdownMenuItem(value: "pill-prog", child: Text("Progesterone-Only Pill")),
                        DropdownMenuItem(value: "patch", child: Text("Hormonal Patch")),
                        DropdownMenuItem(value: "iud", child: Text("Intrauterine Device (IUD)")),
                        DropdownMenuItem(value: "condoms", child: Text("Barrier / Condoms")),
                      ],
                      onChanged: (val) => setState(() => _ladyContraception = val ?? "none"),
                    ),
                  ),
                ),
              ],
            )
          ],
        );
      } else if (_currentStep == 2) {
        return Column(
          children: [
            _buildDateTile("LAST PERIOD DATE", _ladyLastPeriod, () {
              _selectDate(context, _ladyLastPeriod, (val) {
                setState(() {
                  _ladyLastPeriod = val;
                });
              });
            }),
            const SizedBox(height: 16),
            _buildDateTile("LAST CERVICAL SMEAR DATE", _ladyLastSmear, () {
              _selectDate(context, _ladyLastSmear, (val) {
                setState(() {
                  _ladyLastSmear = val;
                });
              });
            }),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("HPV VACCINE DOSES", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9).withOpacity(0.5),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _ladyHpvDoses,
                      isExpanded: true,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                      items: const [
                        DropdownMenuItem(value: "0", child: Text("None")),
                        DropdownMenuItem(value: "1", child: Text("1 Dose")),
                        DropdownMenuItem(value: "2", child: Text("2 Doses (Completed)")),
                      ],
                      onChanged: (val) => setState(() => _ladyHpvDoses = val ?? "2"),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("ACTIVE HORMONAL SYMPTOMS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                const SizedBox(height: 8),
                _buildCheckToggle("Pelvic Cramps", _symptomCramps, accent, (v) => setState(() => _symptomCramps = v)),
                _buildCheckToggle("Abdominal Bloating", _symptomBloating, accent, (v) => setState(() => _symptomBloating = v)),
                _buildCheckToggle("Physical Fatigue", _symptomFatigue, accent, (v) => setState(() => _symptomFatigue = v)),
                _buildCheckToggle("Skin Breakouts", _symptomBreakouts, accent, (v) => setState(() => _symptomBreakouts = v)),
              ],
            )
          ],
        );
      } else {
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFCA5A5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(TablerIcons.shield, color: accent, size: 20),
                      const SizedBox(width: 8),
                      const Text("Zero-Knowledge Encrypted Vault", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Ahnara Lady stores pelvic scans, pain maps, and fertility calendars inside an encrypted vault. Toggle below to confirm consent.",
                    style: TextStyle(fontSize: 10.5, color: Colors.grey.shade700, height: 1.3),
                  ),
                  const SizedBox(height: 16),
                  _buildCheckToggle("I consent to store encrypted reproductive logs", _ladyVaultConsent, accent, (v) => setState(() => _ladyVaultConsent = v)),
                ],
              ),
            )
          ],
        );
      }
    }

    // ========================================================
    // 4. ADOLESCENT CARE (GIRLIE)
    // ========================================================
    if (_currentStep == 1) {
      return Column(
        children: [
          _buildTextField(controller: _girlieNameController, label: "MY FULL NAME", hint: "e.g. Jane Doe", prefixIcon: Icons.person),
          const SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("AGE VERIFICATION", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                  Text("${_girlieAge.toInt()} Years Old", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: accent)),
                ],
              ),
              Slider(
                value: _girlieAge,
                min: 10,
                max: 20,
                activeColor: accent,
                inactiveColor: Colors.pink.shade50,
                onChanged: (val) => setState(() => _girlieAge = val),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("PUBERTY MILESTONES", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              _buildCheckToggle("First period started", _girlieFirstPeriod, accent, (v) => setState(() => _girlieFirstPeriod = v)),
              _buildCheckToggle("Height growth check", _girlieHeightGrowth, accent, (v) => setState(() => _girlieHeightGrowth = v)),
            ],
          )
        ],
      );
    } else if (_currentStep == 2) {
      return Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.pink.shade50.withOpacity(0.3),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.pink.shade100),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Enable local PIN Screen Lock", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                    Switch(
                      value: _girliePinEnabled,
                      activeColor: accent,
                      onChanged: (val) => setState(() => _girliePinEnabled = val),
                    )
                  ],
                ),
                if (_girliePinEnabled) ...[
                  const SizedBox(height: 16),
                  _buildTextField(controller: _girliePinController, label: "SET 4-DIGIT PASSCODE PIN", hint: "e.g. 4892", keyboardType: TextInputType.number),
                ]
              ],
            ),
          )
        ],
      );
    } else {
      return Column(
        children: [
          _buildTextField(controller: _girlieParentController, label: "PARENT GUARD SYNC CODE", hint: "e.g. MAMA-849-204", prefixIcon: Icons.person),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => setState(() => _girlieParentSynced = !_girlieParentSynced),
            style: ElevatedButton.styleFrom(
              backgroundColor: _girlieParentSynced ? const Color(0xFFD1FAE5) : const Color(0xFF001C28),
              foregroundColor: _girlieParentSynced ? Colors.green.shade800 : Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_girlieParentSynced) const Icon(Icons.check, size: 14, color: Colors.green),
                if (_girlieParentSynced) const SizedBox(width: 6),
                Text(
                  _girlieParentSynced ? "Linked to Guard" : "Simulate Parent Sync Link",
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          )
        ],
      );
    }
  }

  Widget _buildDropdownRow({required String label, required int value, required List<DropdownMenuItem<int>> items, required Function(int?) onChanged}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ),
          Expanded(
            flex: 3,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<int>(
                  value: value,
                  isExpanded: true,
                  items: items,
                  onChanged: onChanged,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildMobilityBtn(String val, String label) {
    final active = _elderMobility == val;
    final accent = _getWorkspaceColor();
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _elderMobility = val),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: active ? Colors.indigo.shade50 : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: active ? accent : Colors.grey.shade300, width: active ? 2 : 1),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: active ? accent : const Color(0xFF001C28)),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 2. DASHBOARD / CONTAINER WIDGET
// ==========================================
class DashboardPage extends StatefulWidget {
  final bool initialIsKidsMode;
  final int initialWorkspaceIndex; // 0 = Mama, 1 = Kids, 2 = Seniors, 3 = Lady, 4 = Girlie
  final Map<String, dynamic>? onboardingData;
  const DashboardPage({super.key, this.initialIsKidsMode = false, this.initialWorkspaceIndex = 0, this.onboardingData});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  late int _workspaceIndex; // 0 = Mama, 1 = Kids, 2 = Seniors, 3 = Lady, 4 = Girlie
  bool get _isKidsMode => _workspaceIndex == 1;
  String _userName = "Tyra Reed";
  String _userSub = "tyra@ahnara.com • Gestation Week 12";

  @override
  void initState() {
    super.initState();
    _workspaceIndex = widget.initialWorkspaceIndex;
    if (widget.initialIsKidsMode && _workspaceIndex == 0) {
      _workspaceIndex = 1;
    }

    // Set default names based on workspace index
    if (_workspaceIndex == 0) {
      _userName = "Tyra Reed";
      _userSub = "tyra@ahnara.com • Gestation Week $_selectedGestationWeek";
    } else if (_workspaceIndex == 1) {
      _userName = "Aria Reed (Child)";
      _userSub = "Age: 3 months • Pediatric Care";
    } else if (_workspaceIndex == 2) {
      _userName = "Margaret Dhillon";
      _userSub = "Age: 72 years • Geriatric Care";
    } else if (_workspaceIndex == 3) {
      _userName = "Clara Reed";
      _userSub = "Age: 28 years • Lady Care";
    } else if (_workspaceIndex == 4) {
      _userName = "Jane Doe";
      _userSub = "Age: 14 years • Adolescent Care";
    }

    if (widget.onboardingData != null) {
      final data = widget.onboardingData!;
      if (_workspaceIndex == 0) {
        if (data.containsKey('gestationWeeks')) {
          _selectedGestationWeek = data['gestationWeeks'] ?? 12;
        }
        _userSub = "tyra@ahnara.com • Gestation Week $_selectedGestationWeek";
        if (data.containsKey('maternalPartnerCode') && data['maternalIsSynced'] == true) {
          _partnerSynced = true;
        }
      } else if (_workspaceIndex == 1) {
        _userName = "${data['childName'] ?? 'Aria Reed'} (Child)";
        _userSub = "Born: ${data['childDob'] ?? 'April 10, 2026'} • ${data['biologicalSex'] ?? 'Female'}";
      } else if (_workspaceIndex == 2) {
        _userName = data['elderName'] ?? "Margaret Dhillon";
        _userSub = "Born: ${data['elderDob'] ?? '1954'} • Geriatric Care";
        if (data.containsKey('voiceConsentLogged')) {
          _voiceConsentSeniors = data['voiceConsentLogged'] ?? false;
        }
      } else if (_workspaceIndex == 3) {
        _userName = data['ladyName'] ?? "Clara Reed";
        _userSub = "Born: ${data['ladyDob'] ?? '1998'} • Lady Care";
      } else if (_workspaceIndex == 4) {
        _girlieAge = (data['girlieAge'] != null) ? double.tryParse(data['girlieAge'].toString()) ?? 14.0 : 14.0;
        _girlieFirstPeriod = data['girlieFirstPeriod'] ?? true;
        _girlieHeightGrowth = data['girlieHeightGrowth'] ?? true;
        _girliePinEnabled = data['girliePinEnabled'] ?? true;
        _girliePinCode = data['girliePinCode'] ?? "4892";
        _girlieParentCode = data['girlieParentCode'] ?? "";
        _girlieParentSynced = data['girlieParentSynced'] ?? false;
        _userName = data['girlieName'] ?? "Jane Doe";
        _userSub = "Age: ${_girlieAge.toInt()} years • Adolescent Care";
      }
    }
  }
  int _currentIndex = 0;
  int _selectedGestationWeek = 12;

  // Real Web-App Vitals State Variables
  String _weight = "68.4";
  String _bpSystolic = "120";
  String _bpDiastolic = "80";
  String _kicks = "12";
  bool _vitalsLoggedToday = false;

  // SENIORS STATE VARIABLES
  bool _seniorsCheckedIn = false;
  String _seniorsCheckInTime = "";
  int _seniorsHeartRate = 72;
  String _seniorsBp = "128/82";
  int _seniorsSteps = 3420;
  bool _companionListening = false;
  bool _companionSpeaking = false;
  int _companionIndex = 0;
  final List<String> _companionTranscript = [];
  final TextEditingController _scamScanController = TextEditingController();
  String _scamScanText = "";
  String? _scamScanResultMessage;
  String? _scamScanResultRisk;
  final TextEditingController _offlineUssdController = TextEditingController();
  bool _offlineUssdSuccess = false;
  bool _voiceConsentSeniors = false;

  // LADY WORKSPACE STATE VARIABLES
  String _ladyFlow = "Medium";
  bool _ladyClots = false;
  double _ladyStress = 4.0;
  double _ladyBbt = 36.65;
  String _ladyMucus = "Creamy";
  bool _ladyLhPeak = false;
  double _ladyPainIntensity = 3.0;
  String _ladyPainLocation = "Uterus";
  int _ladyHotFlushesCount = 2;
  double _ladyJointStiffness = 3.0;
  bool _ladyEstrogenPatch = true;
  bool _ladyProgesteronePill = false;
  bool _ladyTestosteroneGel = false;
  int _kegelSeconds = 0;
  bool _kegelContracting = false;

  // GIRLIE WORKSPACE STATE VARIABLES
  double _girlieAge = 14.0;
  bool _girlieFirstPeriod = true;
  bool _girlieHeightGrowth = true;
  bool _girliePinEnabled = true;
  String _girliePinCode = "4892";
  String _girlieParentCode = "";
  bool _girlieParentSynced = false;
  String _girlieFlow = "Medium";
  double _girliePainIntensity = 3.0;
  bool _girlieCramps = true;
  bool _girlieAcne = false;
  bool _girlieFatigue = true;
  bool _girlieMood = false;
  bool _girlieBloating = false;
  String _girlieAcneLocation = "Forehead";
  bool _girlieCleanserMorning = true;
  bool _girlieSunscreenDay = false;
  bool _girlieMoisturizerNight = false;
  String? _girlieIngredientResult;
  int _girlieQuizStep = 0;
  String? _girlieQuizSelectedOption;
  int _girlieQuizScore = 0;
  bool _girlieQuizShowAnswer = false;
  bool _girlieRequestSent = false;

  final List<Map<String, dynamic>> _seniorsMeds = [
    {'id': 1, 'name': 'Atorvastatin (10mg)', 'taken': true, 'time': '08:00 AM', 'color': 'Blue pill', 'purpose': 'Cholesterol'},
    {'id': 2, 'name': 'Amlodipine (5mg)', 'taken': true, 'time': '08:00 AM', 'color': 'White pill', 'purpose': 'Blood Pressure'},
    {'id': 3, 'name': 'Metformin (500mg)', 'taken': false, 'time': '08:00 PM', 'color': 'Yellow pill', 'purpose': 'Diabetes'},
  ];

  final List<Map<String, dynamic>> _seniorsTasks = [
    {'id': 1, 'text': 'Check morning vitals logged', 'done': true},
    {'id': 2, 'text': 'Verify lunch & hydration', 'done': true},
    {'id': 3, 'text': 'Refill pill organizer box', 'done': false},
    {'id': 4, 'text': 'Take short walk in the garden', 'done': false},
  ];

  // NATIVE BIRTH PLAN STATE
  BirthPlanModel _birthPlan = BirthPlanModel(
    companionName: 'Nathaniel Dhillon',
    companionRole: 'Husband / Partner',
    painManagement: ['Natural Breathing'],
    environment: ['Low Lighting', 'Quiet Room'],
    backupHospital: 'Health Center A',
    transportType: 'Personal Car',
    bloodType: 'O-positive (O+)',
    donorName: 'Musa Ibrahim',
    donorPhone: '+234 809 111 2222',
    isLocked: false,
    verificationStatus: 'draft',
  );

  // Local state for supplements (integrated from meds web app)
  final List<Map<String, dynamic>> _supplements = [
    {'id': 'iron', 'name': 'Iron (60mg)', 'taken': false, 'time': 'Morning'},
    {'id': 'folic', 'name': 'Folic Acid (400mcg)', 'taken': true, 'time': 'Morning'},
    {'id': 'calcium', 'name': 'Calcium (500mg)', 'taken': false, 'time': 'Evening'},
  ];

  // AI Chat Messages state
  final List<Map<String, dynamic>> _chatMessages = [
    {
      'sender': 'midwife',
      'text': 'Hello Tyra. I am your Ahnara AI Midwife. How are you feeling today? You can type your symptoms below or tap any quick-chips to begin triage.',
      'time': '12:00 PM',
      'isWarning': false
    }
  ];

  // NARA Partner Sync state
  bool _partnerSynced = false;
  final String _partnerCode = "NARA-401-290";

  double _calculateAdherence() {
    int taken = _supplements.where((s) => s['taken'] == true).length;
    return taken / _supplements.length;
  }

  @override
  Widget build(BuildContext context) {
    final double adherence = _calculateAdherence();

    // Bottom Tab Content Switching - matches webapp menu items 1-to-1
    Widget bodyContent;
    if (_workspaceIndex == 1) {
      switch (_currentIndex) {
        case 0:
          bodyContent = KidsDashboardContent(
            childName: widget.onboardingData?['childName'] ?? "Aria Reed",
            childDetails: widget.onboardingData != null
                ? "Born: ${widget.onboardingData?['childDob'] ?? 'April 10, 2026'} • ${widget.onboardingData?['biologicalSex'] ?? 'Female'}"
                : "Born: April 10, 2026 • 3 Months Old • Female",
          );
          break;
        case 1:
          bodyContent = const PediatricianChatContent();
          break;
        case 2:
          bodyContent = const KidsImmunizationContent();
          break;
        case 3:
          bodyContent = const KidsGrowthCurveContent();
          break;
        case 4:
          bodyContent = const KidsMilestonesContent();
          break;
        case 5:
          bodyContent = const KidsAcademyContent();
          break;
        default:
          bodyContent = KidsDashboardContent(
            childName: widget.onboardingData?['childName'] ?? "Aria Reed",
            childDetails: widget.onboardingData != null
                ? "Born: ${widget.onboardingData?['childDob'] ?? 'April 10, 2026'} • ${widget.onboardingData?['biologicalSex'] ?? 'Female'}"
                : "Born: April 10, 2026 • 3 Months Old • Female",
          );
      }
    } else if (_workspaceIndex == 2) {
      switch (_currentIndex) {
        case 0:
          bodyContent = _buildSeniorsTodayContent();
          break;
        case 1:
          bodyContent = _buildSeniorsCompanionContent();
          break;
        case 2:
          bodyContent = _buildSeniorsMedsContent();
          break;
        case 3:
          bodyContent = _buildSeniorsVitalsContent();
          break;
        case 4:
          bodyContent = _buildSeniorsScamShieldContent();
          break;
        case 5:
          bodyContent = _buildSeniorsCircleContent();
          break;
        default:
          bodyContent = _buildSeniorsTodayContent();
      }
    } else if (_workspaceIndex == 3) {
      switch (_currentIndex) {
        case 0:
          bodyContent = _buildLadyTodayContent();
          break;
        case 1:
          bodyContent = _buildLadyFertilityContent();
          break;
        case 2:
          bodyContent = _buildLadyScreeningsContent();
          break;
        case 3:
          bodyContent = _buildLadyPainMapContent();
          break;
        case 4:
          bodyContent = _buildLadyKegelContent();
          break;
        case 5:
          bodyContent = _buildLadyHotFlushContent();
          break;
        default:
          bodyContent = _buildLadyTodayContent();
      }
    } else if (_workspaceIndex == 4) {
      switch (_currentIndex) {
        case 0:
          bodyContent = _buildGirlieGuideContent();
          break;
        case 1:
          bodyContent = _buildGirlieCrampContent();
          break;
        case 2:
          bodyContent = _buildGirlieCoachContent();
          break;
        case 3:
          bodyContent = _buildGirlieBodyContent();
          break;
        case 4:
          bodyContent = _buildGirlieSkinContent();
          break;
        case 5:
          bodyContent = _buildGirlieSafetyContent();
          break;
        default:
          bodyContent = _buildGirlieGuideContent();
      }
    } else {
      switch (_currentIndex) {
        case 0:
          bodyContent = _buildTodayDashboardContent(adherence);
          break;
        case 1:
          bodyContent = _buildMidwifeChatContent();
          break;
        case 2:
          bodyContent = const AncCheckpointsContent();
          break;
        case 3:
          bodyContent = _buildBirthPlanContent();
          break;
        case 4:
          bodyContent = _buildMedsContent();
          break;
        case 5:
          bodyContent = const AcademyContent();
          break;
        default:
          bodyContent = _buildTodayDashboardContent(adherence);
      }
    }

    return Scaffold(
      backgroundColor: const Color(0xFFE8EFF4),
      extendBody: true,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            _buildDashboardHeader(),
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                switchInCurve: Curves.easeOutCubic,
                switchOutCurve: Curves.easeInCubic,
                transitionBuilder: (Widget child, Animation<double> animation) {
                  return FadeTransition(
                    opacity: animation,
                    child: SlideTransition(
                      position: Tween<Offset>(
                        begin: const Offset(0.0, 0.04),
                        end: Offset.zero,
                      ).animate(animation),
                      child: child,
                    ),
                  );
                },
                child: Container(
                  key: ValueKey<int>(_currentIndex),
                  child: bodyContent,
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.only(left: 16.0, right: 16.0, bottom: 22.0, top: 4.0),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF001C28).withOpacity(0.06),
                blurRadius: 16,
                spreadRadius: 2,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(28),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 12.0, sigmaY: 12.0),
              child: Container(
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: Colors.white.withOpacity(0.5), width: 1.5),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Bottom navigation tabs mapping 1-to-1 to Today, AI Midwife, Antenatal, Birth Plan, Meds, Academy
                    if (_workspaceIndex == 1) ...[
                      _buildNavItem(0, TablerIcons.layout_dashboard, 'Today'),
                      _buildNavItem(1, TablerIcons.message_chatbot, 'Pediat.'),
                      _buildNavItem(2, TablerIcons.calendar, 'Vaccines'),
                      _buildNavItem(3, TablerIcons.file_description, 'Growth'),
                      _buildNavItem(4, TablerIcons.pill, 'Milest.'),
                      _buildNavItem(5, TablerIcons.book, 'Academy'),
                    ] else if (_workspaceIndex == 2) ...[
                      _buildNavItem(0, TablerIcons.layout_dashboard, 'SafeDay'),
                      _buildNavItem(1, TablerIcons.message_chatbot, 'AI Chat'),
                      _buildNavItem(2, TablerIcons.pill, 'Meds'),
                      _buildNavItem(3, TablerIcons.activity, 'Vitals'),
                      _buildNavItem(4, TablerIcons.shield, 'Scam Sh.'),
                      _buildNavItem(5, TablerIcons.calendar, 'Circle'),
                    ] else if (_workspaceIndex == 3) ...[
                      _buildNavItem(0, TablerIcons.calendar, 'Cycle'),
                      _buildNavItem(1, TablerIcons.activity, 'Fertil.'),
                      _buildNavItem(2, TablerIcons.shield, 'Screen.'),
                      _buildNavItem(3, TablerIcons.map_pin, 'PainMap'),
                      _buildNavItem(4, TablerIcons.clock, 'Kegels'),
                      _buildNavItem(5, TablerIcons.flame, 'HotFlush'),
                    ] else if (_workspaceIndex == 4) ...[
                      _buildNavItem(0, TablerIcons.book, 'Guide'),
                      _buildNavItem(1, TablerIcons.activity, 'CrampLog'),
                      _buildNavItem(2, TablerIcons.message_chatbot, 'AICoach'),
                      _buildNavItem(3, TablerIcons.scale, 'BodyImg'),
                      _buildNavItem(4, TablerIcons.user, 'Skin'),
                      _buildNavItem(5, TablerIcons.shield, 'Safety'),
                    ] else ...[
                      _buildNavItem(0, TablerIcons.layout_dashboard, 'Today'),
                      _buildNavItem(1, TablerIcons.message_chatbot, 'Midwife'),
                      _buildNavItem(2, TablerIcons.calendar, 'Antenatal'),
                      _buildNavItem(3, TablerIcons.file_description, 'Birth Plan'),
                      _buildNavItem(4, TablerIcons.pill, 'Meds'),
                      _buildNavItem(5, TablerIcons.book, 'Academy'),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Consistent top header across the dashboard pages (no background)
  Widget _buildDashboardHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Translucent Logo circle and App Name
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: (_workspaceIndex == 1 
                      ? const Color(0xFF0089C1) 
                      : _workspaceIndex == 2 
                      ? const Color(0xFF6366F1) 
                      : _workspaceIndex == 3 
                      ? const Color(0xFFE11D48) 
                      : _workspaceIndex == 4 
                      ? const Color(0xFFE572A1) 
                      : const Color(0xFFD4F475)).withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(
                      color: _workspaceIndex == 1 
                          ? const Color(0xFF0089C1) 
                          : _workspaceIndex == 2 
                          ? const Color(0xFF6366F1) 
                          : _workspaceIndex == 3 
                          ? const Color(0xFFE11D48) 
                          : _workspaceIndex == 4 
                          ? const Color(0xFFE572A1) 
                          : const Color(0xFFD4F475), 
                      width: 1),
                ),
                child: Image.asset('assets/logo.png', width: 22, height: 22),
              ),
              const SizedBox(width: 8),
              Text(
                _workspaceIndex == 1 
                    ? 'Ahnara Kids' 
                    : _workspaceIndex == 2 
                    ? 'Ahnara Seniors' 
                    : _workspaceIndex == 3 
                    ? 'Ahnara Lady' 
                    : _workspaceIndex == 4 
                    ? 'Ahnara Girlie' 
                    : 'Ahnara Family',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF001C28),
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
          
          // Right: Action Icons (Emergency, Notification, Profile)
          Row(
            children: [
              // Emergency Button (SOS)
              GestureDetector(
                onTap: _triggerEmergencySOS,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFCA5A5)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.gpp_maybe_rounded, size: 14, color: Color(0xFFDC2626)),
                      SizedBox(width: 4),
                      Text(
                        'SOS',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFFDC2626)),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              
              // Notification Icon
              GestureDetector(
                onTap: _showNotificationsBottomSheet,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: const Icon(TablerIcons.bell, size: 16, color: Color(0xFF001C28)),
                    ),
                    Positioned(
                      right: 1,
                      top: 1,
                      child: Container(
                        width: 7,
                        height: 7,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFF904C),
                          shape: BoxShape.circle,
                        ),
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(width: 10),
              
              // Profile Avatar Icon
              GestureDetector(
                onTap: _showProfileBottomSheet,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: const Icon(TablerIcons.user, size: 16, color: Color(0xFF001C28)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Emergency SOS bottom sheet dialog
  void _triggerEmergencySOS() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(color: Color(0xFFFEF2F2), shape: BoxShape.circle),
                  child: const Icon(Icons.gpp_maybe_rounded, size: 40, color: Color(0xFFDC2626)),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Emergency SOS Active',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 10),
                Text(
                  'This will instantly broadcast your live GPS tracking location and trigger emergency hospital dispatch to Health Center A.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: const Color(0xFF001C28).withOpacity(0.6), height: 1.4),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(context),
                        style: OutlinedButton.styleFrom(shape: const StadiumBorder()),
                        child: const Text('Cancel', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              backgroundColor: const Color(0xFFDC2626),
                              content: Text(_workspaceIndex == 2 
                                ? 'SOS Dispatch Sent to Jane Doe (Daughter) & Emergency Services!'
                                : 'SOS Dispatch Sent to Nathaniel Reed (Partner) & Emergency Services!'),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFDC2626),
                          foregroundColor: Colors.white,
                          shape: const StadiumBorder(),
                        ),
                        child: const Text('Confirm SOS', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        );
      },
    );
  }

  // Notifications bottom sheet logs
  void _showNotificationsBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Notifications',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 16),
                _buildNotificationItem(
                  icon: TablerIcons.pill,
                  title: 'Daily Supplement Reminder',
                  subtitle: 'Take Iron & Calcium supplements',
                  time: '1 hour ago',
                ),
                _buildNotificationItem(
                  icon: TablerIcons.calendar,
                  title: 'Clinic Checkpoint visit',
                  subtitle: 'Visit 3 Scheduled for July 12',
                  time: '2 hours ago',
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF001C28),
                      foregroundColor: Colors.white,
                      shape: const StadiumBorder(),
                    ),
                    child: const Text('Close', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildNotificationItem({required IconData icon, required String title, required String subtitle, required String time}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(color: Color(0xFFE8F3CE), shape: BoxShape.circle),
            child: Icon(icon, size: 16, color: const Color(0xFF608216)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ),
          Text(time, style: const TextStyle(fontSize: 8, color: Colors.grey)),
        ],
      ),
    );
  }

  // Profile bottom sheet details
  void _showProfileBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFD4F475).withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(TablerIcons.user, size: 36, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 12),
                Text(
                  _userName,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                Text(
                  _userSub,
                  style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: const Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Blood Type', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                          Text('O-Negative', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                        ],
                      ),
                      Divider(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Backup Hospital', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                          Text('Health Center A', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                        ],
                      ),
                      Divider(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Partner Link Status', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                          Text('Nathaniel Reed (Synced)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0089C1))),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      setState(() {
                        _workspaceIndex = _workspaceIndex == 1 ? 0 : 1;
                        _currentIndex = 0;
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF0089C1),
                      side: const BorderSide(color: Color(0xFF0089C1)),
                      shape: const StadiumBorder(),
                    ),
                    child: Text(
                      _isKidsMode ? 'Switch to Maternal Workspace' : 'Switch to Pediatric Workspace',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => FamilyDashboardPage(
                                activeWorkspaceIndex: _workspaceIndex,
                                currentUserName: _userName,
                              ),
                            ),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF6366F1),
                          side: const BorderSide(color: Color(0xFF6366F1)),
                          shape: const StadiumBorder(),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        icon: const Icon(TablerIcons.layout_dashboard, size: 16),
                        label: const Text('Family Hub', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => AhnaraCircleFeedPage(
                                activeWorkspaceIndex: _workspaceIndex,
                                currentUserName: _userName,
                              ),
                            ),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF9B59B6),
                          side: const BorderSide(color: Color(0xFF9B59B6)),
                          shape: const StadiumBorder(),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        icon: const Icon(TablerIcons.users, size: 16),
                        label: const Text('Circle Feed', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => AhnaraAcademyPage(
                            activeWorkspaceIndex: _workspaceIndex,
                            currentUserName: _userName,
                          ),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF0089C1),
                      side: const BorderSide(color: Color(0xFF0089C1)),
                      shape: const StadiumBorder(),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(TablerIcons.book, size: 16),
                    label: const Text('Ahnara Academy', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF001C28),
                      foregroundColor: Colors.white,
                      shape: const StadiumBorder(),
                    ),
                    child: const Text('Close', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Styled active capsule pill navigation (matching layoutTabBackground of webapp)
  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = index == _currentIndex;
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF001C28) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : Colors.grey.shade400,
              size: 18,
            ),
            if (isSelected) ...[
              const SizedBox(width: 4),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              )
            ]
          ],
        ),
      ),
    );
  }

  // ==========================================
  // TAB 0: TODAY DASHBOARD
  // ==========================================
  Widget _buildTodayDashboardContent(double adherence) {
    final Map<int, Map<String, String>> milestones = {
      4: {'name': 'Poppy Seed', 'icon': '🌱', 'size': '2 mm', 'weight': 'Under 1g', 'desc': 'Your baby is an embryo composed of two cell layers preparing for organ development.'},
      8: {'name': 'Raspberry', 'icon': '🍒', 'size': '1.6 cm', 'weight': '1 g', 'desc': "Baby's heart beats at 150 BPM. Facial features and limbs are shaping up rapidly."},
      12: {'name': 'Lime', 'icon': '🍋', 'size': '5.4 cm', 'weight': '14 g', 'desc': 'Organ systems are in place. Baby can curl tiny toes and open/close their mouth.'},
      16: {'name': 'Avocado', 'icon': '🥑', 'size': '11.6 cm', 'weight': '100 g', 'desc': "Baby's eyes move side to side. They can grasp the umbilical cord now."},
      20: {'name': 'Banana', 'icon': '🍌', 'size': '25.6 cm', 'weight': '300 g', 'desc': 'Halfway mark! The skin is covered with a protective vernix coating. Quickening starts.'},
      24: {'name': 'Cantaloupe', 'icon': '🍈', 'size': '30 cm', 'weight': '600 g', 'desc': 'Acquiring vital body fat. Real hair is starting to grow on their scalp.'},
      28: {'name': 'Eggplant', 'icon': '🍆', 'size': '37.6 cm', 'weight': '1 kg', 'desc': 'Lungs can breathe air, eyes can blink, and sleep cycles are regular.'},
      32: {'name': 'Squash', 'icon': '🍍', 'size': '42.4 cm', 'weight': '1.7 kg', 'desc': 'Baby occupies most of the womb. Kick counts are strong and frequent.'},
      36: {'name': 'Papaya', 'icon': '🥭', 'size': '47.4 cm', 'weight': '2.6 kg', 'desc': 'Fully formed organs. Baby is dropping into the pelvic cavity for labor.'},
      40: {'name': 'Watermelon', 'icon': '🍉', 'size': '51.2 cm', 'weight': '3.4 kg', 'desc': 'Full term! Your baby is ready to meet the world.'},
    };

    Map<String, String> getMilestone(int week) {
      final keys = milestones.keys.toList()..sort();
      int matchedKey = keys.first;
      for (final k in keys) {
        if (week >= k) matchedKey = k;
      }
      return milestones[matchedKey]!;
    }

    final activeMilestone = getMilestone(_selectedGestationWeek);
    final isCurrentWeek = _selectedGestationWeek == 12;

    // Launch vitals logging bottom sheet modal
    void showVitalsLogModal() {
      final TextEditingController weightController = TextEditingController(text: _weight);
      final TextEditingController systolicController = TextEditingController(text: _bpSystolic);
      final TextEditingController diastolicController = TextEditingController(text: _bpDiastolic);
      final TextEditingController kicksController = TextEditingController(text: _kicks);

      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.white,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        builder: (ctx) {
          return Padding(
            padding: EdgeInsets.only(
              top: 24,
              left: 24,
              right: 24,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Log Maternal Vitals',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.grey),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Weight Form
                  const Text('Weight (kg)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                  const SizedBox(height: 6),
                  Container(
                    decoration: BoxDecoration(color: const Color(0xFFF1F5F9).withOpacity(0.5), borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: TextField(
                      controller: weightController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(border: InputBorder.none, hintText: 'e.g. 68.5'),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // BP Forms Row
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Systolic BP (mmHg)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                            const SizedBox(height: 6),
                            Container(
                              decoration: BoxDecoration(color: const Color(0xFFF1F5F9).withOpacity(0.5), borderRadius: BorderRadius.circular(14)),
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              child: TextField(
                                controller: systolicController,
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                decoration: const InputDecoration(border: InputBorder.none, hintText: '120'),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Diastolic BP (mmHg)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                            const SizedBox(height: 6),
                            Container(
                              decoration: BoxDecoration(color: const Color(0xFFF1F5F9).withOpacity(0.5), borderRadius: BorderRadius.circular(14)),
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              child: TextField(
                                controller: diastolicController,
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                decoration: const InputDecoration(border: InputBorder.none, hintText: '80'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Fetal Kicks Form (WHO recommends 24+ weeks)
                  if (_selectedGestationWeek >= 24) ...[
                    const Text('Fetal Kick Count (Kicks / 2 Hours)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                    const SizedBox(height: 6),
                    Container(
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9).withOpacity(0.5), borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: TextField(
                        controller: kicksController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(border: InputBorder.none, hintText: 'WHO recommends 10+ kicks'),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.pop(ctx),
                          style: OutlinedButton.styleFrom(
                            shape: const StadiumBorder(),
                            side: BorderSide(color: Colors.grey.shade300),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: const Text('Cancel', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _weight = weightController.text;
                              _bpSystolic = systolicController.text;
                              _bpDiastolic = diastolicController.text;
                              if (_selectedGestationWeek >= 24) {
                                _kicks = kicksController.text;
                              }
                              _vitalsLoggedToday = true;
                            });
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Vitals logged to hospital FHIR database!')),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0089C1),
                            foregroundColor: Colors.white,
                            shape: const StadiumBorder(),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: const Text('Submit Logs', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 24.0, right: 24.0, top: 16.0, bottom: 120.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Hello, Tyra',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -1.0,
                      color: Color(0xFF001C28),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'You are in Week $_selectedGestationWeek of your pregnancy timeline.',
                    style: TextStyle(
                      fontSize: 12,
                      color: const Color(0xFF001C28).withOpacity(0.5),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  const Icon(TablerIcons.alert_triangle, color: Color(0xFFFF904C), size: 16),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F3CE),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFCDE0A4)),
                    ),
                    child: Text(
                      'Trimester ${_selectedGestationWeek < 13 ? "1" : _selectedGestationWeek < 27 ? "2" : "3"}',
                      style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF608216)),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Swipeable Pregnancy Timeline Explorer
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Pregnancy Timeline Explorer',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 0.5),
                    ),
                    Text(
                      'Current: Week $_selectedGestationWeek',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF608216), fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 52,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: 40,
                    itemBuilder: (context, index) {
                      final w = index + 1;
                      final isWeekActive = _selectedGestationWeek == w;
                      final isCompleted = w < 12;
                      final isCurrent = w == 12;

                      Color boxColor;
                      Color txtColor;
                      Border? border;

                      if (isWeekActive) {
                        boxColor = const Color(0xFF1E293B);
                        txtColor = Colors.white;
                      } else if (isCurrent) {
                        boxColor = const Color(0xFFD4F475);
                        txtColor = const Color(0xFF608216);
                        border = Border.all(color: const Color(0xFFCDE0A4));
                      } else if (isCompleted) {
                        boxColor = const Color(0xFFE8F3CE).withOpacity(0.6);
                        txtColor = const Color(0xFF608216).withOpacity(0.8);
                      } else {
                        boxColor = Colors.grey.shade50;
                        txtColor = Colors.grey.shade400;
                        border = Border.all(color: const Color(0xFF1E293B).withOpacity(0.05));
                      }

                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedGestationWeek = w;
                          });
                        },
                        child: Container(
                          width: 48,
                          margin: const EdgeInsets.only(right: 8),
                          decoration: BoxDecoration(
                            color: boxColor,
                            borderRadius: BorderRadius.circular(12),
                            border: border,
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Wk',
                                style: TextStyle(fontSize: 8, color: txtColor.withOpacity(0.6), fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '$w',
                                style: TextStyle(fontSize: 14, color: txtColor, fontWeight: FontWeight.w900),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Vitals Grid (Fetal HR, Weight, Pill Adherence, Log Vitals)
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.25,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              // Card 1: Fetal HR
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Fetal HR', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey)),
                        Container(
                          width: 24,
                          height: 24,
                          decoration: const BoxDecoration(color: Color(0xFFEFF6FF), shape: BoxShape.circle),
                          child: const Icon(TablerIcons.heart, size: 12, color: Color(0xFF3B82F6)),
                        )
                      ],
                    ),
                    const Expanded(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 4.0),
                        child: FetalHeartRateChart(),
                      ),
                    ),
                    const Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text('145', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                        SizedBox(width: 4),
                        Text('BPM', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.grey)),
                      ],
                    )
                  ],
                ),
              ),

              // Card 2: Weight Tracker
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Weight', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey)),
                        Container(
                          width: 24,
                          height: 24,
                          decoration: const BoxDecoration(color: Color(0xFFF0FDFA), shape: BoxShape.circle),
                          child: const Icon(TablerIcons.scale, size: 12, color: Color(0xFF14B8A6)),
                        )
                      ],
                    ),
                    const Expanded(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 4.0),
                        child: MaternalWeightChart(),
                      ),
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(_weight, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                        const SizedBox(width: 4),
                        const Text('KG', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.grey)),
                      ],
                    )
                  ],
                ),
              ),

              // Card 3: Adherence Card (Redirecting click to Meds tab!)
              GestureDetector(
                onTap: () {
                  setState(() {
                    _currentIndex = 4; // Switch to Meds tab
                  });
                },
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Pill Adherence', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey)),
                          Container(
                            width: 24,
                            height: 24,
                            decoration: const BoxDecoration(color: Color(0xFFF9FBE7), shape: BoxShape.circle),
                            child: const Icon(TablerIcons.pill, size: 12, color: Color(0xFF8BB436)),
                          )
                        ],
                      ),
                      const Spacer(),
                      Container(
                        width: double.infinity,
                        height: 6,
                        decoration: BoxDecoration(
                          color: const Color(0xFFE2E8F0),
                          borderRadius: BorderRadius.circular(3),
                        ),
                        child: FractionallySizedBox(
                          alignment: Alignment.centerLeft,
                          widthFactor: adherence,
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF8BB436),
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                      ),
                      const Spacer(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${(adherence * 100).toInt()}%', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                          Text(
                            '${_supplements.where((s) => s['taken'] == true).length}/${_supplements.length}', 
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              ),

              // Card 4: Log Vitals Card (BP & Kicks simulation feedback)
              GestureDetector(
                onTap: showVitalsLogModal,
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: const Color(0xFF0089C1).withOpacity(0.2),
                      width: 1.5,
                      style: BorderStyle.solid,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [BoxShadow(color: const Color(0xFF1E293B).withOpacity(0.08), blurRadius: 4, offset: const Offset(0, 2))],
                        ),
                        child: const Icon(Icons.add, size: 16, color: Color(0xFF0089C1)),
                      ),
                      const SizedBox(height: 8),
                      const Text('Log Vitals', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0089C1))),
                      Text(_vitalsLoggedToday ? 'Synced to FHIR ✓' : 'BP, Weight & Kicks', style: TextStyle(fontSize: 8, color: _vitalsLoggedToday ? const Color(0xFF10B981) : Colors.grey, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Supplements compliance list (Integrated layout matching left section of webapp bottom row)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFE8F3CE),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFCDE0A4).withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Medication Compliance',
                          style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF608216), letterSpacing: 0.5),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Supplements Today',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                        ),
                      ],
                    ),
                    const Icon(TablerIcons.pill, color: Color(0xFF608216), size: 18),
                  ],
                ),
                const SizedBox(height: 14),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _supplements.length,
                  itemBuilder: (context, index) {
                    final med = _supplements[index];
                    final taken = med['taken'] as bool;
                    
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _supplements[index]['taken'] = !taken;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: taken ? Colors.white : const Color(0xFFE8F3CE).withOpacity(0.45),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: taken ? const Color(0xFFCDE0A4) : const Color(0xFFC7DB9C).withOpacity(0.4),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 18,
                                  height: 18,
                                  decoration: BoxDecoration(
                                    color: taken ? const Color(0xFF8BB436) : Colors.white.withOpacity(0.5),
                                    borderRadius: BorderRadius.circular(6),
                                    border: taken ? null : Border.all(color: const Color(0xFFC7DB9C)),
                                  ),
                                  child: taken
                                      ? const Icon(Icons.check, size: 12, color: Colors.white)
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  med['name'] as String,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900,
                                    color: taken ? const Color(0xFF608216) : const Color(0xFF608216).withOpacity(0.8),
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              (med['time'] as String).toUpperCase(),
                              style: const TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF608216),
                              ),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Baby Growth Milestone (Lime Green two-tone card layout matching webapp dashboard)
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8F3CE).withOpacity(0.3),
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    border: const Border(bottom: BorderSide(color: Color(0xFFE2E8F0), width: 0.5)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFC7DB9C).withOpacity(0.4)),
                        ),
                        child: Center(
                          child: Text(activeMilestone['icon']!, style: const TextStyle(fontSize: 28)),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'GESTATION WEEK $_selectedGestationWeek ${isCurrentWeek ? "(ACTIVE)" : ""}',
                              style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF608216), letterSpacing: 0.5),
                            ),
                            Text(
                              'Size of a ${activeMilestone['name']}',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Text('Length: ${activeMilestone['size'] ?? 'N/A'}', style: TextStyle(fontSize: 10, color: Colors.grey.shade500, fontWeight: FontWeight.bold)),
                                const SizedBox(width: 8),
                                Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.grey, shape: BoxShape.circle)),
                                const SizedBox(width: 8),
                                Text('Weight: ${activeMilestone['weight'] ?? 'N/A'}', style: TextStyle(fontSize: 10, color: Colors.grey.shade500, fontWeight: FontWeight.bold)),
                              ],
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    activeMilestone['desc']!,
                    style: TextStyle(fontSize: 12, color: const Color(0xFF001C28).withOpacity(0.7), fontWeight: FontWeight.w500, height: 1.4),
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Clinic Appointments Card (matches Web Sidebar card)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(TablerIcons.calendar, color: Color(0xFF009EDA), size: 18),
                        const SizedBox(width: 8),
                        const Text(
                          'Clinic Schedule',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                        ),
                      ],
                    ),
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F3CE),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFCDE0A4)),
                      ),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('JUL', style: TextStyle(fontSize: 7, fontWeight: FontWeight.bold, color: Color(0xFF608216))),
                          Text('12', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF608216), height: 1.1)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'WHO VISIT 3',
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF009EDA), letterSpacing: 0.5),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Urine Protein & Growth Check',
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Midwife Tyra • Health Center A',
                            style: TextStyle(fontSize: 10, color: Colors.grey.shade500, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFA7F3D0).withOpacity(0.5)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.check_circle_rounded, color: const Color(0xFF10B981), size: 14),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Synced to Hospital FHIR spine',
                          style: TextStyle(fontSize: 9, color: Color(0xFF065F46), fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // NARA Partner Sync Card (matches Web Sidebar card)
          GestureDetector(
            onTap: () {
              setState(() {
                _partnerSynced = !_partnerSynced;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(_partnerSynced ? 'NARA Partner Companion Linked!' : 'NARA Partner Link Suspended!'),
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(TablerIcons.qrcode, color: Color(0xFF0089C1), size: 18),
                          const SizedBox(width: 8),
                          const Text(
                            'NARA Partner Sync',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                          ),
                        ],
                      ),
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _partnerSynced ? const Color(0xFF10B981) : Colors.orange,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        _partnerCode,
                        style: const TextStyle(fontFamily: 'Courier', fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _partnerSynced
                        ? '✓ Partner active. Vitals updates and Emergency SOS alerts are shared with your partner companion.'
                        : '⚠ Unlinked. Partner won\'t receive emergency GPS dispatch or vitals updates automatically.',
                    style: TextStyle(fontSize: 10, color: Colors.grey.shade500, fontWeight: FontWeight.bold, height: 1.3),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 1: AI MIDWIFE MESSAGES CHAT
  // ==========================================
  Widget _buildMidwifeChatContent() {
    final TextEditingController chatInputController = TextEditingController();
    final List<String> quickChips = ['Bleeding issues', 'Severe headaches', 'Feet swelling', 'Fetal kicks'];

    void processBotReply(String userText) {
      final String lowerText = userText.toLowerCase();
      String replyText = '';
      bool isWarning = false;

      if (lowerText.contains('bleed') || lowerText.contains('blood') || lowerText.contains('spotting')) {
        replyText = '⚠ CRITICAL ALERT: Any vaginal bleeding during pregnancy requires immediate medical examination. Please visit Health Center A immediately or click the emergency button to call a nurse.';
        isWarning = true;
      } else if (lowerText.contains('headache') || lowerText.contains('migraine') || lowerText.contains('vision')) {
        replyText = '⚠ CLINICAL NOTICE: Severe headaches with blurry vision can indicate high blood pressure (pre-eclampsia). Please rest and monitor your BP. If BP exceeds 140/90, consult clinic emergency.';
        isWarning = true;
      } else if (lowerText.contains('swell') || lowerText.contains('feet') || lowerText.contains('edema')) {
        replyText = 'Fluid retention in feet is common. However, sudden swelling in face or hands requires a blood pressure check. Elevate your legs above heart level for 20 mins.';
      } else if (lowerText.contains('kick') || lowerText.contains('move')) {
        replyText = 'Fetal tracking is critical. From Week 24, WHO recommends recording kick cycles. You should feel at least 10 movements within a 2-hour window when resting.';
      } else {
        replyText = 'Thank you for logging your symptoms. I have stored this in your daily wellness profile. Please consult your clinic midwife if you experience sudden pain.';
      }

      setState(() {
        _chatMessages.add({
          'sender': 'midwife',
          'text': replyText,
          'time': 'Just now',
          'isWarning': isWarning
        });
      });
    }

    void handleSendUserMsg(String text) {
      if (text.trim().isEmpty) return;
      setState(() {
        _chatMessages.add({
          'sender': 'user',
          'text': text,
          'time': 'Just now',
          'isWarning': false
        });
      });
      Future.delayed(const Duration(milliseconds: 1000), () {
        processBotReply(text);
      });
    }

    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('AI Midwife Triage', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  Text('Online • Automated triage & nurse responses', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(12)),
                child: IconButton(
                  icon: const Icon(Icons.phone_in_talk, color: Color(0xFFDC2626), size: 18),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        title: const Text('Emergency Hotline', style: TextStyle(fontWeight: FontWeight.w900)),
                        content: const Text('Do you want to dial the emergency maternal response coordinator at Health Center A?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: Colors.grey))),
                          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Call Nurse', style: TextStyle(color: Color(0xFF0089C1), fontWeight: FontWeight.bold))),
                        ],
                      ),
                    );
                  },
                ),
              )
            ],
          ),
        ),

        // Chat message list
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: _chatMessages.length,
            itemBuilder: (context, index) {
              final msg = _chatMessages[index];
              final isUser = msg['sender'] == 'user';
              final isWarning = msg['isWarning'] as bool;

              if (isUser) {
                return Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12, left: 40),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: const BoxDecoration(
                      color: Color(0xFF001C28),
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(16),
                        bottomLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                      ),
                    ),
                    child: Text(
                      msg['text'] as String,
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ),
                );
              } else {
                return Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12, right: 40),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isWarning ? const Color(0xFFFEF2F2) : Colors.white,
                      border: isWarning ? Border.all(color: const Color(0xFFFCA5A5)) : null,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                        bottomRight: Radius.circular(16),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg['text'] as String,
                          style: TextStyle(
                            color: isWarning ? const Color(0xFF991B1B) : const Color(0xFF001C28),
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (isWarning) ...[
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.warning_amber_rounded, color: Color(0xFF991B1B), size: 12),
                              const SizedBox(width: 4),
                              Text(
                                'Risk logged to clinical spine',
                                style: TextStyle(fontSize: 8, color: const Color(0xFF991B1B).withOpacity(0.8), fontWeight: FontWeight.bold),
                              )
                            ],
                          )
                        ]
                      ],
                    ),
                  ),
                );
              }
            },
          ),
        ),

        // Quick symptom chips
        Container(
          height: 38,
          margin: const EdgeInsets.symmetric(vertical: 6),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: quickChips.length,
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: () {
                  handleSendUserMsg(quickChips[index]);
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
                  ),
                  child: Center(
                    child: Text(
                      quickChips[index],
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF0089C1)),
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Input bar
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.05))),
          ),
          padding: const EdgeInsets.only(left: 16, right: 16, top: 12, bottom: 12 + 106),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: TextField(
                    controller: chatInputController,
                    decoration: const InputDecoration(
                      hintText: 'Describe symptoms or ask midwives...',
                      border: InputBorder.none,
                      hintStyle: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Container(
                decoration: const BoxDecoration(color: Color(0xFF001C28), shape: BoxShape.circle),
                child: IconButton(
                  icon: const Icon(Icons.send, color: Colors.white, size: 14),
                  onPressed: () {
                    final txt = chatInputController.text;
                    chatInputController.clear();
                    handleSendUserMsg(txt);
                  },
                ),
              )
            ],
          ),
        )
      ],
    );
  }

  // ==========================================
  // TAB 3: BIRTH PLAN CONTENT
  // ==========================================
  Widget _buildBirthPlanContent() {
    final bool isLocked = _birthPlan.isLocked;
    final List<String> painOptions = ['Natural Breathing', 'Water Immersion', 'Epidural', 'Massage Therapy'];
    final List<String> envOptions = ['Low Lighting', 'Quiet Room', 'Soft Music', 'Aromatherapy'];
    final List<String> bloodOptions = ['O-positive (O+)', 'O-negative (O-)', 'A-positive (A+)', 'B-positive (B+)', 'AB-positive (AB+)'];

    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 24.0, right: 24.0, top: 24.0, bottom: 120.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Digital Birth Plan',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
              ),
              if (isLocked)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(8)),
                  child: const Text('SUBMITTED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Labor preferences, companions & backup safety keys',
            style: TextStyle(fontSize: 13, color: const Color(0xFF001C28).withOpacity(0.5), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 24),

          const Text(
            'Labor Room Preferences',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
          ),
          const SizedBox(height: 12),

          // Companion fields
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
            child: Column(
              children: [
                TextField(
                  enabled: !isLocked,
                  decoration: const InputDecoration(
                    labelText: 'Companion Name',
                    border: InputBorder.none,
                    labelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  controller: TextEditingController(text: _birthPlan.companionName),
                  onChanged: (val) => _birthPlan.companionName = val,
                ),
                const Divider(height: 1),
                TextField(
                  enabled: !isLocked,
                  decoration: const InputDecoration(
                    labelText: 'Companion Role / Relationship',
                    border: InputBorder.none,
                    labelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  controller: TextEditingController(text: _birthPlan.companionRole),
                  onChanged: (val) => _birthPlan.companionRole = val,
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Pain options wrap
          const Text('Pain Management Preference', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: painOptions.map((opt) {
              final isSelected = _birthPlan.painManagement.contains(opt);
              return GestureDetector(
                onTap: () {
                  if (isLocked) return;
                  setState(() {
                    if (isSelected) {
                      _birthPlan.painManagement.remove(opt);
                    } else {
                      _birthPlan.painManagement.add(opt);
                    }
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF001C28) : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isSelected ? const Color(0xFF001C28) : const Color(0xFF1E293B).withOpacity(0.12)),
                  ),
                  child: Text(
                    opt,
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF001C28)),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Environment options wrap
          const Text('Environment Preferences', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: envOptions.map((opt) {
              final isSelected = _birthPlan.environment.contains(opt);
              return GestureDetector(
                onTap: () {
                  if (isLocked) return;
                  setState(() {
                    if (isSelected) {
                      _birthPlan.environment.remove(opt);
                    } else {
                      _birthPlan.environment.add(opt);
                    }
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF001C28) : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isSelected ? const Color(0xFF001C28) : const Color(0xFF1E293B).withOpacity(0.12)),
                  ),
                  child: Text(
                    opt,
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF001C28)),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          const Text(
            'Safety & Backups',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
          ),
          const SizedBox(height: 12),

          // Backups inputs
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  enabled: !isLocked,
                  decoration: const InputDecoration(
                    labelText: 'Backup Facility / Hospital',
                    border: InputBorder.none,
                    labelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  controller: TextEditingController(text: _birthPlan.backupHospital),
                  onChanged: (val) => _birthPlan.backupHospital = val,
                ),
                const Divider(height: 1),
                const SizedBox(height: 8),
                const Text('Maternal Blood Type', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                DropdownButton<String>(
                  value: _birthPlan.bloodType,
                  isExpanded: true,
                  underline: const SizedBox(),
                  items: bloodOptions.map((String val) {
                    return DropdownMenuItem<String>(
                      value: val,
                      child: Text(val, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    );
                  }).toList(),
                  onChanged: isLocked 
                      ? null 
                      : (newVal) {
                          if (newVal != null) {
                            setState(() {
                              _birthPlan.bloodType = newVal;
                            });
                          }
                        },
                ),
                const Divider(height: 1),
                TextField(
                  enabled: !isLocked,
                  decoration: const InputDecoration(
                    labelText: 'Donor Name',
                    border: InputBorder.none,
                    labelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  controller: TextEditingController(text: _birthPlan.donorName),
                  onChanged: (val) => _birthPlan.donorName = val,
                ),
                const Divider(height: 1),
                TextField(
                  enabled: !isLocked,
                  decoration: const InputDecoration(
                    labelText: 'Donor Contact Phone',
                    border: InputBorder.none,
                    labelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  controller: TextEditingController(text: _birthPlan.donorPhone),
                  onChanged: (val) => _birthPlan.donorPhone = val,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Submit action
          if (!isLocked)
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    _birthPlan.isLocked = true;
                    _birthPlan.verificationStatus = 'pending';
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Birth Plan locked & logged to clinical spine!')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF001C28),
                  foregroundColor: Colors.white,
                  shape: const StadiumBorder(),
                ),
                child: const Text('Lock & Submit Plan for Signoff', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            )
          else
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFF2563EB)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'This birth plan has been verified and locked. Midwife Priscilla will verify details at your next checkpoint.',
                      style: TextStyle(fontSize: 11, color: const Color(0xFF1E3A8A).withOpacity(0.9), fontWeight: FontWeight.w600, height: 1.4),
                    ),
                  )
                ],
              ),
            ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 4: MEDS COMPLIANCE (Supplements page)
  // ==========================================
  Widget _buildMedsContent() {
    final double adherence = _calculateAdherence();
    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 24.0, right: 24.0, top: 24.0, bottom: 120.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Medication logs',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
          ),
          const SizedBox(height: 6),
          Text(
            'Track your daily supplements compliance & adherence status',
            style: TextStyle(fontSize: 13, color: const Color(0xFF001C28).withOpacity(0.5), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 24),

          // Compliance Progress Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFA7F3D0)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                  child: const Icon(Icons.medical_information, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'COMPLIANCE STATS',
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF047857), letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Pill Adherence: ${(adherence * 100).toInt()}%',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF065F46)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'You completed ${_supplements.where((s) => s['taken'] == true).length} of ${_supplements.length} logs today.',
                        style: const TextStyle(fontSize: 10, color: Color(0xFF065F46), fontWeight: FontWeight.w500),
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Checklist Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Daily Checklist',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 14),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _supplements.length,
                  itemBuilder: (context, index) {
                    final med = _supplements[index];
                    final taken = med['taken'] as bool;
                    
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _supplements[index]['taken'] = !taken;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: taken ? const Color(0xFFF9FBE7) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: taken ? const Color(0xFFE2F0D9) : const Color(0xFF1E293B).withOpacity(0.03),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    color: taken ? const Color(0xFF8BB436) : Colors.white,
                                    borderRadius: BorderRadius.circular(6),
                                    border: taken ? null : Border.all(color: Colors.grey.shade300),
                                  ),
                                  child: taken
                                      ? const Icon(Icons.check, size: 12, color: Colors.white)
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  med['name'] as String,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: taken ? const Color(0xFF608216) : const Color(0xFF001C28),
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              (med['time'] as String).toUpperCase(),
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                                color: Colors.grey.shade500,
                              ),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  // ==========================================
  // SENIORS WORKSPACE SCREENS
  // ==========================================

  // 1. SafeDay Wellbeing Hub Dashboard
  Widget _buildSeniorsTodayContent() {
    int takenMeds = _seniorsMeds.where((m) => m['taken'] == true).length;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Daily Check-in Card
        Card(
          color: _seniorsCheckedIn ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(
              color: _seniorsCheckedIn ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A),
              width: 1.5,
            ),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Wellbeing Status',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: _seniorsCheckedIn ? const Color(0xFF047857) : const Color(0xFFB45309),
                        letterSpacing: 1.0,
                      ),
                    ),
                    Icon(
                      _seniorsCheckedIn ? Icons.check_circle : Icons.pending_actions_rounded,
                      color: _seniorsCheckedIn ? const Color(0xFF047857) : const Color(0xFFB45309),
                      size: 20,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  _seniorsCheckedIn ? "Checked in as OK today!" : "Pending Daily Check-In",
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF001C28),
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _seniorsCheckedIn 
                    ? "Log entry registered at $_seniorsCheckInTime. Trusted Circle has been notified."
                    : "Confirm you are safe today to notify your caregiver network.",
                  style: TextStyle(
                    fontSize: 12,
                    color: const Color(0xFF001C28).withOpacity(0.6),
                    fontWeight: FontWeight.bold,
                    height: 1.4,
                  ),
                ),
                if (!_seniorsCheckedIn) ...[
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          _seniorsCheckedIn = true;
                          _seniorsCheckInTime = DateTime.now().toLocal().toString().split(' ')[1].substring(0, 5);
                        });
                      },
                      icon: const Icon(Icons.check, size: 18),
                      label: const Text("I'M OK TODAY", style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 0.5)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD97706),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Vitals Overview Row
        Row(
          children: [
            Expanded(
              child: Card(
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
                ),
                elevation: 0,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('HEART RATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                          Icon(Icons.favorite, color: Colors.redAccent, size: 16),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text('$_seniorsHeartRate', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                          const SizedBox(width: 4),
                          const Text('BPM', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Card(
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
                ),
                elevation: 0,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('BLOOD PRESS.', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                          Icon(Icons.monitor_heart, color: Colors.indigo, size: 16),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(_seniorsBp, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                          const SizedBox(width: 4),
                          const Text('mmHg', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Meds Progress overview Card
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('MEDICATION TIMELINE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Text('$takenMeds of ${_seniorsMeds.length} Taken', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 16),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _seniorsMeds.length,
                  itemBuilder: (context, idx) {
                    final med = _seniorsMeds[idx];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: med['taken'] ? const Color(0xFFEEF2F6) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                med['taken'] ? Icons.check_box_outlined : Icons.check_box_outline_blank,
                                color: med['taken'] ? Colors.indigo : Colors.grey,
                                size: 20,
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    med['name'],
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF001C28),
                                      decoration: med['taken'] ? TextDecoration.lineThrough : null,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    "${med['color']} • ${med['purpose']}",
                                    style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Text(
                              med['time'],
                              style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Scam Shield Warning strip
        Card(
          color: const Color(0xFFFEF2F2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: Color(0xFFFCA5A5)),
          ),
          elevation: 0,
          child: const ListTile(
            leading: Icon(Icons.shield_outlined, color: Colors.redAccent),
            title: Text('Scam Shield Active', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
            subtitle: Text('NLP scanning blocks incoming bank phishing messages.', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 2. AI Companion & Ambient Cognitive Check
  Widget _buildSeniorsCompanionContent() {
    final conversation = [
      {'prompt': "Hello Margaret! How are you doing today? Can you tell me what you had for breakfast?", 'reply': "I am doing well! For breakfast I had some oatmeal with strawberries.", 'metric': "Memory Recall: Verified (Fast response)"},
      {'prompt': "Wonderful! Do you remember who is visiting you this afternoon?", 'reply': "Yes, my daughter Jane is coming to check on me around 4 PM.", 'metric': "Memory Recall: Verified (Correct family)"},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Pulsing Sphere Card
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Text(
                  'AMBIENT VOICE AUDIT',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.0),
                ),
                const SizedBox(height: 24),
                // Pulsing Sphere Representation
                Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      if (_companionListening || _companionSpeaking) ...[
                        AnimatedContainer(
                          duration: const Duration(seconds: 1),
                          width: _companionListening ? 140 : 120,
                          height: _companionListening ? 140 : 120,
                          decoration: BoxDecoration(
                            color: _companionListening 
                              ? Colors.indigo.withOpacity(0.1) 
                              : const Color(0xFF10B981).withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: _companionListening 
                            ? Colors.indigo 
                            : _companionSpeaking 
                            ? const Color(0xFF10B981) 
                            : Colors.grey.shade200,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: (_companionListening ? Colors.indigo : Colors.grey).withOpacity(0.3),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Icon(
                          _companionListening 
                            ? Icons.mic 
                            : _companionSpeaking 
                            ? Icons.volume_up 
                            : Icons.volume_off_outlined,
                          color: _companionListening || _companionSpeaking ? Colors.white : Colors.grey,
                          size: 32,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  _companionListening 
                    ? "Listening..." 
                    : _companionSpeaking 
                    ? "Speaking..." 
                    : "Tap below to begin voice check",
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 8),
                Text(
                  _companionListening 
                    ? "Please speak clearly into your phone's microphone." 
                    : _companionSpeaking 
                    ? conversation[_companionIndex % conversation.length]['prompt']!
                    : "Passively checks speech latency and cognitive memory checks.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: const Color(0xFF001C28).withOpacity(0.6), height: 1.4),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: _companionListening || _companionSpeaking 
                      ? null 
                      : () {
                          setState(() {
                            _companionListening = true;
                          });
                          Future.delayed(const Duration(seconds: 3), () {
                            if (!mounted) return;
                            setState(() {
                              _companionListening = false;
                              _companionSpeaking = true;
                              final cur = conversation[_companionIndex % conversation.length];
                              _companionTranscript.add("Margaret: \"${cur['reply']}\"");
                              _companionTranscript.add("Metric: ${cur['metric']}");
                            });
                            Future.delayed(const Duration(milliseconds: 3500), () {
                              if (!mounted) return;
                              setState(() {
                                _companionSpeaking = false;
                                _companionIndex++;
                              });
                            });
                          });
                        },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                    child: const Text('RESPOND TO COMPANION', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Transcript log Card
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('SPEECH AUDIT TRANSCRIPT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                if (_companionTranscript.isEmpty) ...[
                  const Text('No speech audits recorded yet. Tap start to check.', style: TextStyle(fontSize: 12, color: Colors.grey, fontStyle: FontStyle.italic)),
                ] else ...[
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _companionTranscript.length,
                    itemBuilder: (context, idx) {
                      final item = _companionTranscript[idx];
                      final isMetric = item.startsWith("Metric:");
                      return Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isMetric ? const Color(0xFFEEF2F6) : const Color(0xFFF1F5F9).withOpacity(0.5),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Text(
                          item,
                          style: TextStyle(
                            fontSize: 11, 
                            fontWeight: isMetric ? FontWeight.bold : FontWeight.normal,
                            color: isMetric ? Colors.indigo : const Color(0xFF001C28),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 3. Medication Scheduler & USSD Tracker
  Widget _buildSeniorsMedsContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Inventory warnings
        Card(
          color: const Color(0xFFFEF2F2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: Color(0xFFFCA5A5)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 16),
                    SizedBox(width: 8),
                    Text('Low Med Inventory Alert', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFDC2626))),
                  ],
                ),
                const SizedBox(height: 6),
                const Text('Atorvastatin (10mg) is low. Only 4 doses remaining.', style: TextStyle(fontSize: 12, color: Color(0xFF001C28), fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Order submitted to pharmacy!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFFDC2626),
                      side: const BorderSide(color: Color(0xFFFCA5A5)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    child: const Text('ORDER REFILLS NOW (£12.99)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Interactive dose checking list
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('TODAY DOSES', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 16),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _seniorsMeds.length,
                  itemBuilder: (context, idx) {
                    final med = _seniorsMeds[idx];
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _seniorsMeds[idx]['taken'] = !_seniorsMeds[idx]['taken'];
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: med['taken'] ? const Color(0xFFF5F3FF) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: med['taken'] ? const Color(0xFFDDD6FE) : const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    color: med['taken'] ? Colors.indigo : Colors.white,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: med['taken'] ? Colors.indigo : Colors.grey.shade400),
                                  ),
                                  child: med['taken'] 
                                    ? const Icon(Icons.check, size: 14, color: Colors.white) 
                                    : null,
                                ),
                                const SizedBox(width: 14),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      med['name'],
                                      style: TextStyle(
                                        fontSize: 14, 
                                        fontWeight: FontWeight.bold,
                                        color: const Color(0xFF001C28),
                                        decoration: med['taken'] ? TextDecoration.lineThrough : null,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      "${med['color']} • Dose: ${med['time']}",
                                      style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const Icon(Icons.chevron_right, color: Colors.grey, size: 18),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Offline USSD simulator
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.cell_tower_rounded, color: Colors.indigo, size: 18),
                    SizedBox(width: 8),
                    Text('OFFLINE USSD SYNC SIMULATOR', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                const SizedBox(height: 10),
                const Text('Enter offline code received via USSD/SMS query (e.g. *401*3*1#):', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                TextField(
                  controller: _offlineUssdController,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    hintText: '*401*3*1#',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_offlineUssdController.text.isEmpty) return;
                      setState(() {
                        _offlineUssdSuccess = true;
                        _seniorsMeds[2]['taken'] = true; // Set Metformin taken
                      });
                      Future.delayed(const Duration(seconds: 3), () {
                        if (!mounted) return;
                        setState(() {
                          _offlineUssdSuccess = false;
                          _offlineUssdController.clear();
                        });
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    child: const Text('SYNC OFFLINE CODE', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                if (_offlineUssdSuccess) ...[
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF10B981)),
                    ),
                    child: const Text(
                      '✓ Offline USSD sync confirmed: Metformin logged via SMS relay.',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 4. Vital Logs & Gait Panel
  Widget _buildSeniorsVitalsContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Connected Wearables Status
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('CONNECTED SENSORS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Icon(Icons.sensors, color: Colors.indigo, size: 18),
                  ],
                ),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(color: Color(0xFFEEF2F6), shape: BoxShape.circle),
                    child: const Icon(Icons.watch, color: Colors.indigo),
                  ),
                  title: const Text('SmartWatch Pro', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                  subtitle: const Text('Pulse & steps sync • Battery 84%', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                  trailing: const Chip(backgroundColor: Color(0xFFD1FAE5), label: Text('Active', style: TextStyle(fontSize: 9, color: Color(0xFF047857), fontWeight: FontWeight.bold))),
                ),
                const Divider(),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(color: Color(0xFFEEF2F6), shape: BoxShape.circle),
                    child: const Icon(Icons.sensor_occupied_outlined, color: Colors.indigo),
                  ),
                  title: const Text('Fall Neck Pendant', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                  subtitle: const Text('Accelerometer sync • Battery 92%', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                  trailing: const Chip(backgroundColor: Color(0xFFD1FAE5), label: Text('Active', style: TextStyle(fontSize: 9, color: Color(0xFF047857), fontWeight: FontWeight.bold))),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Gait parameter card
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.directions_walk_rounded, color: Colors.indigo, size: 18),
                    SizedBox(width: 8),
                    Text('GAIT & BALANCE DYNAMICS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: const Color(0xFFEEF2F6), borderRadius: BorderRadius.circular(16)),
                  child: const Row(
                    children: [
                      Icon(Icons.check_circle_outline, color: const Color(0xFF10B981), size: 16),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Gait symmetry is normal (97%). No movement latency deviations detected.',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28), height: 1.3),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Gait Cadence:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('98 steps/min', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                const SizedBox(height: 6),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Stride Length:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('0.65 m (Normal)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Clinical Safety Card
        Card(
          color: const Color(0xFFECFDF5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFA7F3D0)),
          ),
          elevation: 0,
          child: const Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('EMERGENCY MEDICAL CARD', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF047857), letterSpacing: 0.5)),
                SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Blood Group:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('O+ (Rh Positive)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Diagnoses:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('Cardiovascular, Diabetes', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Allergies:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('Penicillin', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 5. Seniors Scam Shield
  Widget _buildSeniorsScamShieldContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Scam Scanner Widget
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.shield_outlined, color: Colors.redAccent, size: 18),
                    SizedBox(width: 8),
                    Text('SCAM TEXT MESSAGE SCANNER', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                const SizedBox(height: 10),
                const Text('Paste any suspicious text message below to check for phishing scams:', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                TextField(
                  controller: _scamScanController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    hintText: 'e.g. You won a pension lottery, click here to transfer...',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      final txt = _scamScanController.text.toLowerCase();
                      if (txt.isEmpty) return;
                      setState(() {
                        _scamScanText = _scamScanController.text;
                        bool containsSpam = ["pension", "lottery", "click", "transfer", "bank", "card", "pin"].any((keyword) => txt.contains(keyword));
                        if (containsSpam) {
                          _scamScanResultRisk = "HIGH";
                          _scamScanResultMessage = "Scam detected! High-risk phishing keywords found. Caregivers alerted.";
                        } else {
                          _scamScanResultRisk = "LOW";
                          _scamScanResultMessage = "This message is likely safe. No immediate fraud patterns detected.";
                        }
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    child: const Text('SCAN MESSAGE NOW', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                if (_scamScanResultMessage != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _scamScanResultRisk == "HIGH" ? const Color(0xFFFEF2F2) : const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: _scamScanResultRisk == "HIGH" ? const Color(0xFFFCA5A5) : const Color(0xFFA7F3D0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Risk Assessment: $_scamScanResultRisk",
                          style: TextStyle(
                            fontSize: 10, 
                            fontWeight: FontWeight.w900, 
                            color: _scamScanResultRisk == "HIGH" ? const Color(0xFFDC2626) : const Color(0xFF047857),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _scamScanResultMessage!,
                          style: TextStyle(
                            fontSize: 11, 
                            fontWeight: FontWeight.bold, 
                            color: _scamScanResultRisk == "HIGH" ? const Color(0xFF991B1B) : const Color(0xFF065F46),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Log of scam incidents
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('SCAM SHIELD THREAT FEED', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.mail_lock_outlined, color: Colors.redAccent),
                  title: const Text('Pension suspended scam link', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                  subtitle: const Text('SMS blocked today, 11:32 AM • Caregiver Jane Doe paged', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                  trailing: const Text('Blocked', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.redAccent)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 6. Trusted Circle & Carer Coordinator
  // ==========================================
  // LADY WORKSPACE CONTENT BUILDERS
  // ==========================================

  // 1. Cycle & Period Logger Dashboard
  Widget _buildLadyTodayContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header stats
        Card(
          color: const Color(0xFFFFF1F2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFFECDD3), width: 1.5),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'CYCLE ACTIVE PHASE',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFE11D48),
                        letterSpacing: 1.0,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE11D48),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Day 22',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Luteal Phase',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 6),
                Text(
                  'Progesterone peaks, supporting potential implantation. Restorative exercise and magnesium intake are recommended.',
                  style: TextStyle(fontSize: 12, color: const Color(0xFF001C28).withOpacity(0.6), height: 1.4),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Flow selectors
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('PERIOD FLOW SIZE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: ['Spotting', 'Light', 'Medium', 'Heavy'].map((flow) {
                    final selected = _ladyFlow == flow;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _ladyFlow = flow;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          decoration: BoxDecoration(
                            color: selected ? const Color(0xFFE11D48) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: selected ? const Color(0xFFE11D48) : const Color(0xFFE2E8F0)),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          alignment: Alignment.center,
                          child: Text(
                            flow,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: selected ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                
                // Clots indicator
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _ladyClots = !_ladyClots;
                    });
                  },
                  child: Row(
                    children: [
                      Icon(
                        _ladyClots ? Icons.check_box_outlined : Icons.square_outlined,
                        color: _ladyClots ? const Color(0xFFE11D48) : Colors.grey,
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Presence of clots (>2.5cm)',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Stress slider
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('CORTISOL & STRESS SCALE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Text(
                      'Level ${_ladyStress.toInt()}/10',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFE11D48)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Slider(
                  min: 1,
                  max: 10,
                  value: _ladyStress,
                  activeColor: const Color(0xFFE11D48),
                  inactiveColor: const Color(0xFFF1F5F9),
                  onChanged: (val) {
                    setState(() {
                      _ladyStress = val;
                    });
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 2. Fertility & BBT Planner
  Widget _buildLadyFertilityContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Fertility Banner
        Card(
          color: const Color(0xFFFEF2F2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFFEE2E2), width: 1.5),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                const Icon(Icons.favorite, color: Color(0xFFE11D48), size: 36),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'FERTILE WINDOW ACTIVE',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFFE11D48), letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Peak Fertility Window',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Your ovulation is predicted in 24-48 hours based on mucus consistency.',
                        style: TextStyle(fontSize: 12, color: const Color(0xFF001C28).withOpacity(0.6), height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // BBT input
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('BASAL BODY TEMPERATURE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${_ladyBbt.toStringAsFixed(2)} °C',
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline, color: Color(0xFFE11D48)),
                          onPressed: () => setState(() => _ladyBbt -= 0.05),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline, color: Color(0xFFE11D48)),
                          onPressed: () => setState(() => _ladyBbt += 0.05),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Cervical Mucus selection
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('CERVICAL MUCUS CONSISTENCY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _ladyMucus,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: ['Dry', 'Creamy', 'Sticky', 'Egg-white / Spinnbarkeit'].map((type) {
                    return DropdownMenuItem<String>(
                      value: type,
                      child: Text(type, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _ladyMucus = val;
                      });
                    }
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // LH Surge kit simulator
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('LH SURGE TEST STRIP', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _ladyLhPeak = !_ladyLhPeak;
                    });
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: _ladyLhPeak ? const Color(0xFFECFDF5) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: _ladyLhPeak ? const Color(0xFF10B981) : const Color(0xFFE2E8F0)),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Icon(
                          _ladyLhPeak ? Icons.check_circle : Icons.radio_button_off,
                          color: _ladyLhPeak ? const Color(0xFF10B981) : Colors.grey,
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _ladyLhPeak ? 'LH Surge Peak Detected (+)' : 'LH Surge Negative (-)',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: _ladyLhPeak ? const Color(0xFF047857) : const Color(0xFF001C28)),
                            ),
                            const SizedBox(height: 2),
                            const Text('Tap to simulate strip scanner upload', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 3. Preventative Screenings Checklist
  Widget _buildLadyScreeningsContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Cervical Smear Test Countdown
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('CERVICAL SMEAR SCREENING', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    const Icon(Icons.shield_outlined, color: const Color(0xFFE11D48), size: 18),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  '18 Months Remaining',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFFE11D48)),
                ),
                const SizedBox(height: 4),
                const Text('Last checked: Oct 2024. Next due: Oct 2027 (Every 3 years).', style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // HPV Vaccine boosters
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('HPV VACCINATION COMPLIANCE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.vaccines, color: const Color(0xFFE11D48)),
                  title: const Text('Dose 1 (Gardasil 9)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  subtitle: const Text('Completed: Age 12', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(Icons.check_circle, color: Color(0xFF10B981)),
                ),
                const Divider(),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.vaccines, color: const Color(0xFFE11D48)),
                  title: const Text('Dose 2 (Booster)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  subtitle: const Text('Completed: Age 13', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(Icons.check_circle, color: Color(0xFF10B981)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Monthly self-exam
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('MONTHLY BREAST SELF-EXAM', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 8),
                const Text('Step 1: Visual Inspection', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 6),
                const Text(
                  'Stand before a mirror with shoulders straight and arms on hips. Look for skin dimpling, swelling, or changes in nipple posture.',
                  style: TextStyle(fontSize: 12, color: Colors.grey, height: 1.4),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Marked monthly self-exam as completed!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE11D48),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('LOG COMPLETED EXAM', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 4. Symptom & Pelvic Pain Map
  Widget _buildLadyPainMapContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Diagram representation
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('PELVIC DIAGRAM HOTSPOTS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: ['Uterus', 'Left Ovary', 'Right Ovary', 'Back'].map((loc) {
                    final selected = _ladyPainLocation == loc;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _ladyPainLocation = loc;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          decoration: BoxDecoration(
                            color: selected ? const Color(0xFFE11D48) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: selected ? const Color(0xFFE11D48) : const Color(0xFFE2E8F0)),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          alignment: Alignment.center,
                          child: Text(
                            loc,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: selected ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Intensity slider
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('PAIN SEVERITY SCALE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Text(
                      'Level ${_ladyPainIntensity.toInt()}/10',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFE11D48)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Slider(
                  min: 1,
                  max: 10,
                  value: _ladyPainIntensity,
                  activeColor: const Color(0xFFE11D48),
                  inactiveColor: const Color(0xFFF1F5F9),
                  onChanged: (val) {
                    setState(() {
                      _ladyPainIntensity = val;
                    });
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Clinical summary builder
        Card(
          color: const Color(0xFFF8FAFC),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('LOG SUMMARY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey)),
                const SizedBox(height: 6),
                Text(
                  'Logging discomfort level ${_ladyPainIntensity.toInt()} in Uterus/$_ladyPainLocation region. Recommended to track against flow size.',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28), height: 1.4),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 5. Sexual Wellness & Pelvic Coach
  Widget _buildLadyKegelContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Coach session card
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Text('PELVIC FLOOR COACH', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 16),
                
                // Animation Circle
                Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    color: _kegelContracting ? const Color(0xFFFFF1F2) : const Color(0xFFF8FAFC),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: _kegelContracting ? const Color(0xFFFDA4AF) : const Color(0xFFE2E8F0),
                      width: _kegelContracting ? 8 : 2,
                    ),
                  ),
                  alignment: Alignment.center,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _kegelContracting ? 'CONTRACT' : 'RELAX',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: _kegelContracting ? const Color(0xFFE11D48) : Colors.grey,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '$_kegelSeconds s',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _kegelContracting = true;
                          _kegelSeconds = 5;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFE11D48),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('START TIMER', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 10),
                    OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _kegelContracting = false;
                          _kegelSeconds = 0;
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.grey,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('RESET', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 6. Perimenopause & Hot Flush Monitor
  Widget _buildLadyHotFlushContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Counter card
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('VASOMOTOR HOT FLUSHES', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Icon(Icons.waves, color: const Color(0xFFE11D48), size: 18),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('Events Logged Today', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(
                  '$_ladyHotFlushesCount',
                  style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: Color(0xFFE11D48)),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _ladyHotFlushesCount += 1;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE11D48),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('LOG FLUSH EVENT', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // HRT dose list
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('DAILY HRT DOSE COMPLIANCE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                
                GestureDetector(
                  onTap: () => setState(() => _ladyEstrogenPatch = !_ladyEstrogenPatch),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Estrogen Patch (Twice Weekly)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    trailing: Icon(
                      _ladyEstrogenPatch ? Icons.check_circle : Icons.circle_outlined,
                      color: _ladyEstrogenPatch ? const Color(0xFFE11D48) : Colors.grey,
                    ),
                  ),
                ),
                const Divider(),
                GestureDetector(
                  onTap: () => setState(() => _ladyProgesteronePill = !_ladyProgesteronePill),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Progesterone Pill (Daily)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    trailing: Icon(
                      _ladyProgesteronePill ? Icons.check_circle : Icons.circle_outlined,
                      color: _ladyProgesteronePill ? const Color(0xFFE11D48) : Colors.grey,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // ==========================================
  // GIRLIE WORKSPACE CONTENT BUILDERS
  // ==========================================

  // 1. Puberty Guide & Baselines
  Widget _buildGirlieGuideContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Age Verification
        Card(
          color: const Color(0xFFFFF0F5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFFFD1DC), width: 1.5),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'AGE VERIFICATION',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFFE572A1), letterSpacing: 0.5),
                    ),
                    Text(
                      '${_girlieAge.toInt()} Years Old',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFE572A1)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Slider(
                  min: 10,
                  max: 20,
                  value: _girlieAge,
                  activeColor: const Color(0xFFE572A1),
                  inactiveColor: const Color(0xFFF1F5F9),
                  onChanged: (val) {
                    setState(() {
                      _girlieAge = val;
                    });
                  },
                ),
                const SizedBox(height: 4),
                const Text(
                  'Tailors all clinical articles to teen-appropriate literacy levels.',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Milestones checklist
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('MY PUBERTY MILESTONES', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => setState(() => _girlieFirstPeriod = !_girlieFirstPeriod),
                        icon: Icon(_girlieFirstPeriod ? Icons.check : Icons.add, size: 14),
                        label: const Text('First Period', style: TextStyle(fontSize: 11)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: _girlieFirstPeriod ? const Color(0xFFE572A1) : Colors.grey,
                          side: BorderSide(color: _girlieFirstPeriod ? const Color(0xFFE572A1) : Colors.grey),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => setState(() => _girlieHeightGrowth = !_girlieHeightGrowth),
                        icon: Icon(_girlieHeightGrowth ? Icons.check : Icons.add, size: 14),
                        label: const Text('Height Spike', style: TextStyle(fontSize: 11)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: _girlieHeightGrowth ? const Color(0xFFE572A1) : Colors.grey,
                          side: BorderSide(color: _girlieHeightGrowth ? const Color(0xFFE572A1) : Colors.grey),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Privacy Locks
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('DISCREET PASSWORD LOCK', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Discreet Passcode Protection', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  value: _girliePinEnabled,
                  activeColor: const Color(0xFFE572A1),
                  onChanged: (val) {
                    setState(() {
                      _girliePinEnabled = val;
                    });
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 2. Simple Period Tracker & Cramp Logger
  Widget _buildGirlieCrampContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // School Bag Alert
        Card(
          color: const Color(0xFFFFF7ED),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFFFEDD5), width: 1.5),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                const Icon(Icons.shopping_bag_outlined, color: Colors.orange, size: 36),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'SCHOOL BAG CHECKLIST',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.orange, letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Period predicted in 3 days',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Remember to pack sanitary pads/liners and spare clothes in your school locker!',
                        style: TextStyle(fontSize: 11, color: const Color(0xFF001C28).withOpacity(0.6), height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Period flow
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('TODAY\'S FLOW', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: ['Light', 'Medium', 'Heavy'].map((flow) {
                    final selected = _girlieFlow == flow;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _girlieFlow = flow),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          decoration: BoxDecoration(
                            color: selected ? const Color(0xFFE572A1) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: selected ? const Color(0xFFE572A1) : const Color(0xFFE2E8F0)),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          alignment: Alignment.center,
                          child: Text(
                            flow,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: selected ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Emoji Pain scale
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('PAIN SEVERITY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Text(
                      _girliePainIntensity == 1
                          ? '😀 (No Pain)'
                          : _girliePainIntensity == 2
                              ? '🙂 (Mild)'
                              : _girliePainIntensity == 3
                                  ? '😐 (Moderate)'
                                  : _girliePainIntensity == 4
                                      ? '😟 (Severe)'
                                      : '😭 (Very Severe)',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFE572A1)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Slider(
                  min: 1,
                  max: 5,
                  value: _girliePainIntensity,
                  activeColor: const Color(0xFFE572A1),
                  inactiveColor: const Color(0xFFF1F5F9),
                  onChanged: (val) {
                    setState(() {
                      _girliePainIntensity = val;
                    });
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Restorative remedies
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('NON-MEDICINAL RELIEF', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.waves, color: Color(0xFFE572A1)),
                  title: const Text('Apply Warm Water Bottle', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  subtitle: const Text('Relaxes tummy muscles & contracts blood flow.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                ),
                const Divider(),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.directions_run, color: Color(0xFFE572A1)),
                  title: const Text('Gentle Pelvic Stretches', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  subtitle: const Text('Try child\'s pose or butterfly spreads to ease lower back.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 3. AI Puberty Coach & Q&A Forum
  Widget _buildGirlieCoachContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // AI Chat conversation
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('DISCREET AI PUBERTY COACH', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(8)),
                      child: const Text('Secure', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.green)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(16)),
                  child: const Text(
                    'Hello! Ask me any sensitive questions about puberty, skin acne, or emotional changes. Everything is kept fully anonymous.',
                    style: TextStyle(fontSize: 12, height: 1.4, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                  ),
                ),
                const SizedBox(height: 12),
                const TextField(
                  decoration: InputDecoration(
                    hintText: 'Ask anything about growing up...',
                    hintStyle: TextStyle(fontSize: 12),
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Moderator Q&A board
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('VERIFIED TEEN Q&A BOARD', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                const Text(
                  'Q: Is vaginal discharge normal?',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 4),
                const Text(
                  'A: Yes! Clear or white discharge is a healthy sign that your reproductive system is cleaning itself.',
                  style: TextStyle(fontSize: 11, color: Colors.grey, height: 1.4),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 4. Growth timeline & self-image checkins
  Widget _buildGirlieBodyContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Intuitive nutrition (no calorie counts)
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('INTUITIVE MEAL CHECKMARKS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 4),
                const Text('Focus on fueling your growth velocity without counting calories.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                const SizedBox(height: 12),
                
                GestureDetector(
                  onTap: () => setState(() => _girlieCleanserMorning = !_girlieCleanserMorning), // reuse similar toggles
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Morning Breakfast', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    trailing: Icon(
                      _girlieCleanserMorning ? Icons.check_circle : Icons.circle_outlined,
                      color: _girlieCleanserMorning ? const Color(0xFFE572A1) : Colors.grey,
                    ),
                  ),
                ),
                const Divider(),
                GestureDetector(
                  onTap: () => setState(() => _girlieSunscreenDay = !_girlieSunscreenDay),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Balanced Lunch', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    trailing: Icon(
                      _girlieSunscreenDay ? Icons.check_circle : Icons.circle_outlined,
                      color: _girlieSunscreenDay ? const Color(0xFFE572A1) : Colors.grey,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Safety warning
        Card(
          color: const Color(0xFFFFF1F2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFFFE4E6)),
          ),
          elevation: 0,
          child: const Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SAFE SPACE SCREENER',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFFE572A1), letterSpacing: 0.5),
                ),
                SizedBox(height: 6),
                Text(
                  'Ahnara safeguards growth without strict numbers. If our AI models detect extreme weight velocity drops, we link you to supportive pediatric experts immediately.',
                  style: TextStyle(fontSize: 11, color: Color(0xFFE572A1), height: 1.4, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 5. Skin acne & hygiene checkmarks
  Widget _buildGirlieSkinContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Face breakout zone selector
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('HORMONAL SKIN BREAKOUTS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: ['Forehead', 'Cheeks', 'Chin', 'Nose'].map((zone) {
                    final selected = _girlieAcneLocation == zone;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _girlieAcneLocation = zone),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          decoration: BoxDecoration(
                            color: selected ? const Color(0xFFE572A1) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: selected ? const Color(0xFFE572A1) : const Color(0xFFE2E8F0)),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          alignment: Alignment.center,
                          child: Text(
                            zone,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: selected ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Cosmetics ingredient warn scanner
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('COSMETICS INGREDIENTS SCANNER', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Enter ingredients list to scan for harsh chemicals...',
                    hintStyle: const TextStyle(fontSize: 12),
                    border: const OutlineInputBorder(),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.search, color: Color(0xFFE572A1)),
                      onPressed: () {
                        setState(() {
                          _girlieIngredientResult = 'Toothpaste Warning: Calcium carbonate severely drys skin and causes post-inflammatory dark spots. Use mild patches instead.';
                        });
                      },
                    ),
                  ),
                ),
                if (_girlieIngredientResult != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: const Color(0xFFFFFBEB), border: Border.all(color: Colors.amber), borderRadius: BorderRadius.circular(12)),
                    child: Text(_girlieIngredientResult!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amber)),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  // 6. Safety Quizzes & Parent sync links
  Widget _buildGirlieSafetyContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Interactive quiz
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('MEDIA LITERACY QUIZ', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                const Text(
                  'Look at this model\'s smooth cheeks with zero lines or pores. Is this photo real or filtered?',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF001C28), height: 1.4),
                ),
                const SizedBox(height: 12),
                
                GestureDetector(
                  onTap: () => setState(() => _girlieQuizSelectedOption = 'Filtered'),
                  child: Container(
                    decoration: BoxDecoration(
                      color: _girlieQuizSelectedOption == 'Filtered' ? const Color(0xFFECFDF5) : const Color(0xFFF8FAFC),
                      border: Border.all(color: _girlieQuizSelectedOption == 'Filtered' ? Colors.green : Colors.grey),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.all(12),
                    child: const Row(
                      children: [
                        Icon(Icons.check_circle_outline, color: Colors.green),
                        SizedBox(width: 8),
                        Text('Filtered / Airbrushed texture', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Screen boundaries break warnings
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: const Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('SCREEN TIME MONITOR', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Icon(Icons.hourglass_bottom, color: Color(0xFFE572A1), size: 18),
                  ],
                ),
                SizedBox(height: 12),
                Text(
                  '55 Minutes Used Today',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                SizedBox(height: 4),
                Text(
                  'Taking breaks prevents digital fatigue. Ahnara will block and request a stretch break after 60 continuous minutes.',
                  style: TextStyle(fontSize: 11, color: Colors.grey, height: 1.4),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }

  Widget _buildSeniorsCircleContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Connected caregivers Calendar
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('CARE SCHEDULE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                    Icon(Icons.calendar_month, color: Colors.indigo, size: 18),
                  ],
                ),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(color: Color(0xFFEEF2F6), shape: BoxShape.circle),
                    child: const Icon(Icons.person, color: Colors.indigo),
                  ),
                  title: const Text('Nurse Home Visit (10:00 AM)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                  subtitle: const Text('Nurse Jevinro K. • GPS Checked in at 10:02 AM', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                  trailing: const Icon(Icons.check_circle, color: const Color(0xFF10B981), size: 18),
                ),
                const Divider(),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(color: Color(0xFFEEF2F6), shape: BoxShape.circle),
                    child: const Icon(Icons.family_restroom, color: Colors.indigo),
                  ),
                  title: const Text('Grocery Assistance (05:00 PM)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                  subtitle: const Text('Jane Doe (Daughter) • Pending', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                  trailing: const Icon(Icons.pending_outlined, color: Colors.grey, size: 18),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Checklists
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('VISIT TASKS CHECKLIST', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                const SizedBox(height: 12),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _seniorsTasks.length,
                  itemBuilder: (context, idx) {
                    final t = _seniorsTasks[idx];
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _seniorsTasks[idx]['done'] = !_seniorsTasks[idx]['done'];
                        });
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: Row(
                          children: [
                            Icon(
                              t['done'] ? Icons.check_circle : Icons.circle_outlined,
                              color: t['done'] ? Colors.indigo : Colors.grey,
                              size: 18,
                            ),
                            const SizedBox(width: 10),
                            Text(
                              t['text'],
                              style: TextStyle(
                                fontSize: 13, 
                                fontWeight: FontWeight.bold, 
                                color: const Color(0xFF001C28),
                                decoration: t['done'] ? TextDecoration.lineThrough : null,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Telehealth Bridge Launcher
        Card(
          color: Colors.indigo,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('AHNARA TELEMEDICINE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white70, letterSpacing: 0.5)),
                const SizedBox(height: 8),
                const Text('Need Clinical Assistance?', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                const SizedBox(height: 6),
                const Text('Launch a direct video consult with on-duty telemedicine doctors immediately.', style: TextStyle(fontSize: 12, color: Colors.white70, height: 1.4)),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PatientTelehealthCallPage(
                            doctorName: "Midwife Ngozi",
                            specialty: "Maternal Health Lead",
                            specialtyCode: "OB/GYN",
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.phone_in_talk, size: 16),
                    label: const Text('LAUNCH CONSULT', style: TextStyle(fontWeight: FontWeight.w900)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.indigo,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }
}

// ==========================================
// 3. ANTENATAL CARE (ANC) CHECKPOINTS CONTENT
// ==========================================
class AncCheckpointsContent extends StatefulWidget {
  const AncCheckpointsContent({super.key});

  @override
  State<AncCheckpointsContent> createState() => _AncCheckpointsContentState();
}

class _AncCheckpointsContentState extends State<AncCheckpointsContent> {
  int _expandedIndex = 2; // Expand active by default (Contact 3)

  final List<Map<String, dynamic>> _contacts = [
    {
      'id': 1,
      'name': 'Contact 1 (First Booking)',
      'window': 'Weeks 8 - 12',
      'status': 'completed',
      'completedDate': 'June 2, 2026',
      'midwife': 'Midwife Priscilla O.',
      'checks': [
        'Blood Pressure Checked (118/78)',
        'LMP & Gestation age validated',
        'First Ultrasound (Single fetus, active heartbeat)',
        'Blood group & Rhesus typing'
      ],
      'notes': 'Healthy initial progress. Recommended daily Prenatal supplements (Folic acid + Iron). Booking scheduled for Contact 2.'
    },
    {
      'id': 2,
      'name': 'Contact 2 (Second Visit)',
      'window': 'Week 20',
      'status': 'completed',
      'completedDate': 'June 30, 2026',
      'midwife': 'Midwife Priscilla O.',
      'checks': [
        'Blood Pressure Checked (120/80)',
        'Fetal quickening checked',
        'Maternal Weight logged',
        'Tetanus Toxoid booster given'
      ],
      'notes': 'Quickening reported by mother. Anomaly ultrasound indicates normal fetal spine, limbs, and heart chambers. Adherence is good.'
    },
    {
      'id': 3,
      'name': 'Contact 3 (Active Session)',
      'window': 'Week 26',
      'status': 'active',
      'checks': [
        'Fundal height measurement',
        'Fetal heart tone auscultation',
        'Maternal BP & Urine protein screen',
        'Oral glucose tolerance test (OGTT)'
      ],
      'notes': 'Currently scheduled for July 12, 2026. Prepare to discuss kick-counting charts during this session.'
    },
    {
      'id': 4,
      'name': 'Contact 4 (Fourth Visit)',
      'window': 'Week 30',
      'status': 'locked',
      'checks': [
        'Fetal position & movement check',
        'Blood pressure log review',
        'Symptom check for pre-eclampsia warning signs',
        'Hemoglobin level check'
      ]
    },
    {
      'id': 5,
      'name': 'Contact 5 (Fifth Visit)',
      'window': 'Week 34',
      'status': 'locked',
      'checks': [
        'Presentation and engagement assessment',
        'Fetal kick counts logging review',
        'Maternal weight and edema screening'
      ]
    },
    {
      'id': 6,
      'name': 'Contact 6 (Sixth Visit)',
      'window': 'Week 36',
      'status': 'locked',
      'checks': [
        'Fetal growth screening',
        'Obstetric risk classification review',
        'Birth Plan final review and midwife signoff'
      ]
    },
    {
      'id': 7,
      'name': 'Contact 7 (Seventh Visit)',
      'window': 'Week 38',
      'status': 'locked',
      'checks': [
        'Cervical assessment, presentation check',
        'Labor preparation briefing',
        'Emergency SOS procedures recall'
      ]
    },
    {
      'id': 8,
      'name': 'Contact 8 (Eighth Visit)',
      'window': 'Week 40',
      'status': 'locked',
      'checks': [
        'Delivery planning checkpoint',
        'Obstetric pelvic assessment check',
        'Fetal heartbeat & contraction screening'
      ]
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'WHO ANC Checkpoints',
                style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF001C28), fontSize: 22),
              ),
              const SizedBox(height: 6),
              Text(
                'Maternal triage checkpoints & regional clinic milestones',
                style: TextStyle(fontSize: 13, color: const Color(0xFF001C28).withOpacity(0.5), fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.only(left: 24.0, right: 24.0, bottom: 120.0),
            itemCount: _contacts.length,
            itemBuilder: (context, index) {
              final contact = _contacts[index];
              final int id = contact['id'] as int;
              final String status = contact['status'] as String;
              final bool isExpanded = _expandedIndex == index;
              
              Color badgeColor;
              Widget statusIcon;

              if (status == 'completed') {
                badgeColor = const Color(0xFFE8F3CE);
                statusIcon = const Icon(Icons.check_circle_rounded, color: Color(0xFF8BB436), size: 16);
              } else if (status == 'active') {
                badgeColor = const Color(0xFFFFF4ED);
                statusIcon = const Icon(Icons.lens, color: Color(0xFFFF904C), size: 10);
              } else {
                badgeColor = Colors.grey.shade100;
                statusIcon = Icon(Icons.lock_outline, color: Colors.grey.shade400, size: 14);
              }

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.05)),
                ),
                child: Theme(
                  data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    initiallyExpanded: isExpanded,
                    key: PageStorageKey(id),
                    onExpansionChanged: (expanded) {
                      if (status == 'locked') return; // prevent expanding locked
                      setState(() {
                        _expandedIndex = expanded ? index : -1;
                      });
                    },
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: badgeColor, shape: BoxShape.circle),
                      child: statusIcon,
                    ),
                    title: Text(
                      contact['name'] as String,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: status == 'locked' ? Colors.grey.shade400 : const Color(0xFF001C28),
                      ),
                    ),
                    subtitle: Text(
                      contact['window'] as String,
                      style: TextStyle(fontSize: 10, color: Colors.grey.shade500, fontWeight: FontWeight.bold),
                    ),
                    trailing: status == 'locked' 
                        ? const SizedBox() 
                        : Icon(isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: Colors.grey),
                    children: [
                      if (status != 'locked')
                        Padding(
                          padding: const EdgeInsets.only(left: 20.0, right: 20.0, bottom: 20.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Divider(height: 1, thickness: 0.5),
                              const SizedBox(height: 14),
                              if (contact.containsKey('midwife')) ...[
                                Row(
                                  children: [
                                    const Icon(Icons.assignment_ind_outlined, size: 14, color: Colors.grey),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Log: ${contact['midwife']} • ${contact['completedDate'] ?? 'Pending'}',
                                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0089C1)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                              ],
                              const Text(
                                'CLINICAL CHECKS COMPLETED',
                                style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 0.5),
                              ),
                              const SizedBox(height: 8),
                              Column(
                                children: (contact['checks'] as List<String>).map((chk) {
                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 6.0),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Icon(Icons.check, color: Color(0xFF8BB436), size: 14),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            chk,
                                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF001C28)),
                                          ),
                                        )
                                      ],
                                    ),
                                  );
                                }).toList(),
                              ),
                              if (contact.containsKey('notes')) ...[
                                const SizedBox(height: 12),
                                const Text(
                                  'MIDWIFE CLINICAL NOTES',
                                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 0.5),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF8FAFC),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    contact['notes'] as String,
                                    style: TextStyle(fontSize: 11, color: const Color(0xFF001C28).withOpacity(0.7), fontWeight: FontWeight.w500, height: 1.4),
                                  ),
                                )
                              ]
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ==========================================
// 4. MATERNAL EDUCATION ACADEMY CONTENT
// ==========================================
class AcademyContent extends StatefulWidget {
  const AcademyContent({super.key});

  @override
  State<AcademyContent> createState() => _AcademyContentState();
}

class _AcademyContentState extends State<AcademyContent> {
  String _selectedCategory = 'All';
  String _searchQuery = '';

  final List<Map<String, dynamic>> _lessons = [
    {
      'id': '1',
      'title': 'Managing Morning Sickness & Early Nutrition',
      'category': 'Nutrition',
      'readTime': '3 min read',
      'trimester': 1,
      'desc': 'Learn effective ways to manage nausea in early pregnancy and key foods rich in Folic acid and Iron.',
      'isAudio': true,
      'content': 'Morning sickness is common in Trimester 1. To manage nausea: eat small, frequent meals throughout the day; focus on plain proteins and complex carbs; stay hydrated by drinking water between meals rather than during them. Key nutrients in early pregnancy include Folic Acid (400mcg daily) to support neural tube development and Iron (60mg daily) to prevent maternal anemia.'
    },
    {
      'id': '2',
      'title': 'Recognizing Pre-eclampsia Warning Signs',
      'category': 'Danger Signs',
      'readTime': '4 min read',
      'trimester': 2,
      'desc': 'Understand what blood pressure flags mean and how to detect sudden swelling or severe headaches early.',
      'isAudio': false,
      'isCritical': true,
      'content': 'Pre-eclampsia is a serious complication characterized by high blood pressure, typically starting after Week 20. Warning signs include: severe persistent headaches; blurry vision or seeing spots; sudden swelling of hands, feet, or face (edema); upper abdominal pain. If you experience these, check your BP immediately. A reading above 140/90 mmHg requires urgent midwife contact.'
    },
    {
      'id': '3',
      'title': 'Safe Aerobic Exercises for Trimester 2',
      'category': 'Exercise',
      'readTime': '5 min read',
      'trimester': 2,
      'desc': 'Simple, doctor-approved stretches and light workouts to maintain cardiac health and pelvic flexibility.',
      'isAudio': false,
      'content': 'Exercise in Trimester 2 helps reduce backaches, improves sleep, and boosts stamina. Safe activities include walking, swimming, and prenatal yoga. Focus on strengthening the pelvic floor (Kegel exercises) to prepare for labor. Avoid exercises that require lying flat on your back for long periods, or any contact sports that present a risk of abdominal impact.'
    },
    {
      'id': '4',
      'title': 'Preparing Your Companion for Labor Room',
      'category': 'Labor Prep',
      'readTime': '6 min read',
      'trimester': 3,
      'desc': 'A practical checklist for your partner, detailing how they can support breathing cycles and monitor vitals.',
      'isAudio': false,
      'content': 'Your birth companion plays a vital role. In the labor room, they can: guide and synchronize breathing rhythms during contractions; assist with positioning and comfort measures (back massages, cold compresses); advocate for your preferences outlined in this birth plan. Ensure they carry emergency hospital contact numbers and backup transport keys.'
    },
    {
      'id': '5',
      'title': 'Fetal Kick Count WHO Best Practices',
      'category': 'Danger Signs',
      'readTime': '3 min read',
      'trimester': 2,
      'desc': 'A detailed guide on tracking fetal movements from week 24 onwards and recording logs in your Today Dashboard.',
      'isAudio': true,
      'content': 'WHO recommends tracking baby movements from Week 24. Find a quiet time to rest on your left side. Count movements (kicks, rolls, flutters). You should record at least 10 distinct movements within a 2-hour window. If baby movements suddenly decrease or stop, contact your emergency midwife triage coordinator immediately.'
    }
  ];

  List<Map<String, dynamic>> _getFilteredLessons() {
    return _lessons.where((les) {
      final matchesCategory = _selectedCategory == 'All' || les['category'] == _selectedCategory;
      final matchesSearch = les['title'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          les['desc'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();
  }

  void _showLessonDetails(Map<String, dynamic> lesson) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            top: 24,
            left: 24,
            right: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: lesson['isCritical'] == true ? const Color(0xFFFEE2E2) : const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      (lesson['category'] as String).toUpperCase(),
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: lesson['isCritical'] == true ? const Color(0xFFDC2626) : const Color(0xFF2563EB),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey),
                    onPressed: () => Navigator.pop(ctx),
                  )
                ],
              ),
              const SizedBox(height: 12),
              Text(
                lesson['title'] as String,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.access_time, size: 12, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(lesson['readTime'] as String, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                  const SizedBox(width: 12),
                  const Icon(Icons.bookmark_outline, size: 12, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text('Trimester ${lesson['trimester']}', style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'LESSON CORE CONTENT',
                style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 0.5),
              ),
              const SizedBox(height: 8),
              Text(
                lesson['content'] as String,
                style: TextStyle(
                  fontSize: 12,
                  color: const Color(0xFF001C28).withOpacity(0.8),
                  height: 1.5,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 24),
              if (lesson['isAudio'] == true) ...[
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(16)),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(color: Color(0xFF0089C1), shape: BoxShape.circle),
                        child: const Icon(Icons.play_arrow, color: Colors.white, size: 18),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Listen to Audio Guide', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                            Text('English, Yoruba, Hausa & Igbo voice notes', style: TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.w500)),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final categories = ['All', 'Nutrition', 'Danger Signs', 'Exercise', 'Labor Prep'];
    final filtered = _getFilteredLessons();

    return Column(
      children: [
        // Header title
        const Padding(
          padding: EdgeInsets.only(left: 24.0, right: 24.0, top: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Maternal Care Academy',
                style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF001C28), fontSize: 22),
              ),
              SizedBox(height: 6),
              Text(
                'Educational articles & midwife audio guides',
                style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        // Search & Filter header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
          child: Column(
            children: [
              // Search field
              Container(
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
                child: TextField(
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
                    });
                  },
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.search, color: Colors.grey),
                    hintText: 'Search lessons or warning symptoms...',
                    hintStyle: TextStyle(fontSize: 12, color: Colors.grey),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Horizontal Category filter chips
              SizedBox(
                height: 38,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    final cat = categories[index];
                    final isSelected = cat == _selectedCategory;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedCategory = cat;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF001C28) : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: isSelected ? const Color(0xFF001C28) : const Color(0xFF1E293B).withOpacity(0.05)),
                        ),
                        child: Center(
                          child: Text(
                            cat,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : const Color(0xFF001C28),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              )
            ],
          ),
        ),

        // Scrollable List of lessons
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.only(left: 24.0, right: 24.0, top: 6.0, bottom: 120.0),
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              final les = filtered[index];
              final isCritical = les['isCritical'] == true;
              
              return GestureDetector(
                onTap: () => _showLessonDetails(les),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isCritical ? const Color(0xFFFCA5A5) : const Color(0xFF1E293B).withOpacity(0.05),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isCritical ? const Color(0xFFFEF2F2) : const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              (les['category'] as String).toUpperCase(),
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: isCritical ? const Color(0xFFDC2626) : Colors.grey,
                              ),
                            ),
                          ),
                          if (isCritical)
                            const Row(
                              children: [
                                Icon(Icons.report_problem, color: Color(0xFFDC2626), size: 12),
                                SizedBox(width: 4),
                                Text(
                                  'CRITICAL WARNING',
                                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFFDC2626)),
                                )
                              ],
                            )
                          else if (les['isAudio'] == true)
                            const Icon(Icons.volume_up, color: Color(0xFF0089C1), size: 14)
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        les['title'] as String,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF001C28)),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        les['desc'] as String,
                        style: TextStyle(fontSize: 11, color: Colors.grey.shade600, fontWeight: FontWeight.w500, height: 1.3),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.access_time, size: 10, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(les['readTime'] as String, style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
                          const SizedBox(width: 12),
                          const Icon(Icons.bookmark_outline, size: 10, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text('Trimester ${les['trimester']}', style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
                        ],
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        )
      ],
    );
  }
}



// ==========================================
// ADDITIONAL HELPER WIDGETS
// ==========================================
class FetalHeartRateChart extends StatelessWidget {
  const FetalHeartRateChart({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(double.infinity, double.infinity),
      painter: HeartRateChartPainter(),
    );
  }
}

class HeartRateChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final path = Path();
    final paint = Paint()
      ..color = const Color(0xFF3B82F6)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final fillPath = Path();
    final fillPaint = Paint()
      ..style = PaintingStyle.fill
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF3B82F6).withOpacity(0.18),
          const Color(0xFF3B82F6).withOpacity(0.0),
        ],
      ).createShader(Rect.fromLTRB(0, 0, size.width, size.height));

    path.moveTo(0, size.height * 0.5);
    
    final points = [
      Offset(size.width * 0.1, size.height * 0.5),
      Offset(size.width * 0.15, size.height * 0.15),
      Offset(size.width * 0.20, size.height * 0.15),
      Offset(size.width * 0.28, size.height * 0.75),
      Offset(size.width * 0.35, size.height * 0.75),
      Offset(size.width * 0.42, size.height * 0.10),
      Offset(size.width * 0.50, size.height * 0.10),
      Offset(size.width * 0.58, size.height * 0.85),
      Offset(size.width * 0.65, size.height * 0.85),
      Offset(size.width * 0.72, size.height * 0.40),
      Offset(size.width * 0.78, size.height * 0.40),
      Offset(size.width * 0.85, size.height * 0.60),
      Offset(size.width * 0.90, size.height * 0.60),
      Offset(size.width * 0.95, size.height * 0.50),
      Offset(size.width, size.height * 0.50),
    ];

    for (int i = 0; i < points.length - 2; i += 2) {
      path.quadraticBezierTo(
        points[i].dx,
        points[i].dy,
        points[i+1].dx,
        points[i+1].dy,
      );
    }
    path.lineTo(size.width, size.height * 0.5);

    fillPath.addPath(path, Offset.zero);
    fillPath.lineTo(size.width, size.height);
    fillPath.lineTo(0, size.height);
    fillPath.close();

    canvas.drawPath(fillPath, fillPaint);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MaternalWeightChart extends StatelessWidget {
  const MaternalWeightChart({super.key});

  @override
  Widget build(BuildContext context) {
    final List<double> heights = [0.38, 0.44, 0.48, 0.51, 0.52, 0.56, 0.59, 0.61, 0.64, 0.68];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: heights.map((h) {
        return Expanded(
          child: Container(
            height: 38.0 * h,
            margin: const EdgeInsets.symmetric(horizontal: 1.5),
            decoration: BoxDecoration(
              color: const Color(0xFF70A4A2),
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        );
      }).toList(),
    );
  }
}




// ==========================================
// PEDIATRIC / KIDS CODE REPLICATED
// ==========================================

class KidsDashboardContent extends StatefulWidget {
  final String childName;
  final String childDetails;
  const KidsDashboardContent({
    super.key,
    this.childName = "Aria Reed",
    this.childDetails = "Born: April 10, 2026 • 3 Months Old • Female",
  });

  @override
  State<KidsDashboardContent> createState() => _KidsDashboardContentState();
}

class _KidsDashboardContentState extends State<KidsDashboardContent> {
  int _selectedMonth = 3;
  double _temp = 36.8;
  double _sleep = 14.5;
  int _feeds = 6;
  int _diapers = 5;

  bool _vitD = false;
  bool _tummyTime = true;
  bool _hygiene = false;

  final TextEditingController _tempController = TextEditingController(text: "36.8");
  final TextEditingController _sleepController = TextEditingController(text: "14.5");
  final TextEditingController _feedsController = TextEditingController(text: "6");
  final TextEditingController _diapersController = TextEditingController(text: "5");

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 120),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Month-by-month timeline selector
          const Text(
            'Baby Milestone Months',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 48,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 25,
              itemBuilder: (context, index) {
                final isSelected = index == _selectedMonth;
                return GestureDetector(
                  onTap: () => setState(() => _selectedMonth = index),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF001C28) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'Month $index',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : const Color(0xFF001C28),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24),

          // Child profile info row
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: Color(0xFFDDEEF3),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(TablerIcons.baby_carriage, color: Color(0xFF0089C1), size: 24),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.childName,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                    ),
                    Text(
                      widget.childDetails,
                      style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Log vitals grid
          const Text(
            'Daily Vitals Indicators',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          GridPaper(
            color: Colors.transparent,
            child: GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.5,
              children: [
                _buildVitalCard('Temperature', '$_temp °C', TablerIcons.temperature, const Color(0xFFFEF2F2), const Color(0xFFEF4444)),
                _buildVitalCard('Sleep Hours', '$_sleep h', TablerIcons.moon, const Color(0xFFEEF2FF), const Color(0xFF6366F1)),
                _buildVitalCard('Feeds Logged', '$_feeds times', TablerIcons.milk, const Color(0xFFECFDF5), const Color(0xFF10B981)),
                _buildVitalCard('Wet Diapers', '$_diapers wet', TablerIcons.droplet, const Color(0xFFFFF7ED), const Color(0xFFF97316)),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Log vitals form inputs
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Record Today Vitals',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _tempController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(labelText: 'Temp (°C)', border: OutlineInputBorder()),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _sleepController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(labelText: 'Sleep (hrs)', border: OutlineInputBorder()),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _feedsController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Feeds Count', border: OutlineInputBorder()),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _diapersController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Wet Diapers', border: OutlineInputBorder()),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _temp = double.tryParse(_tempController.text) ?? _temp;
                        _sleep = double.tryParse(_sleepController.text) ?? _sleep;
                        _feeds = int.tryParse(_feedsController.text) ?? _feeds;
                        _diapers = int.tryParse(_diapersController.text) ?? _diapers;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Vitals logged successfully!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF001C28)),
                    child: const Text('Log Vitals', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Daily checklists
          const Text(
            'Daily Care Checklist',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          _buildCheckItem('Provide Vitamin D drops', _vitD, (val) => setState(() => _vitD = val!)),
          _buildCheckItem('Tummy time practice (15 mins)', _tummyTime, (val) => setState(() => _tummyTime = val!)),
          _buildCheckItem('Skin hygiene & bath checks', _hygiene, (val) => setState(() => _hygiene = val!)),
        ],
      ),
    );
  }

  Widget _buildVitalCard(String title, String val, IconData icon, Color bg, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.04)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
                child: Icon(icon, color: iconColor, size: 14),
              ),
            ],
          ),
          Text(val, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
        ],
      ),
    );
  }

  Widget _buildCheckItem(String title, bool checked, ValueChanged<bool?> onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
      ),
      child: CheckboxListTile(
        title: Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
        value: checked,
        onChanged: onChanged,
        contentPadding: EdgeInsets.zero,
        controlAffinity: ListTileControlAffinity.leading,
        activeColor: const Color(0xFF8BB436),
      ),
    );
  }
}

class PediatricianChatContent extends StatefulWidget {
  const PediatricianChatContent({super.key});

  @override
  State<PediatricianChatContent> createState() => _PediatricianChatContentState();
}

class _PediatricianChatContentState extends State<PediatricianChatContent> {
  final List<Map<String, dynamic>> _messages = [
    {
      'sender': 'pediatrician',
      'text': 'Hello! I am your Ahnara AI Pediatrician. How is your baby feeling today? You can type symptoms below or tap any quick-chips.',
      'time': '12:00 PM',
      'isWarning': false
    }
  ];

  final TextEditingController _controller = TextEditingController();

  void _sendMessage(String text, {bool user = true}) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        'sender': user ? 'user' : 'pediatrician',
        'text': text,
        'time': '12:01 PM',
        'isWarning': false
      });
    });

    if (user) {
      _controller.clear();
      // Mock AI answer after 1 second
      Future.delayed(const Duration(seconds: 1), () {
        String answer = "Thank you for the description. Based on typical development milestones, this is normal. Please ensure room temperature remains constant. If fever exceeds 38°C, consult center immediately.";
        if (text.toLowerCase().contains("fever")) {
          answer = "Fever Alert: For babies under 3 months, any temp > 38°C (100.4°F) is a critical flag. Please pre-notify your pediatrician or trigger SOS if breathing is rapid.";
        } else if (text.toLowerCase().contains("vaccine")) {
          answer = "Immunization reminder: Ensure BCG and OPV doses are logged. The next 6-week vaccine cohort checks are vital.";
        }
        _sendMessage(answer, user: false);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Quick chips
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ["Fever Check", "Vaccination", "Sleep routine", "Digestion", "Cough"].map((c) {
                return GestureDetector(
                  onTap: () => _sendMessage(c),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDDEEF3),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFF0089C1).withOpacity(0.15)),
                    ),
                    child: Text(
                      c,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF0089C1)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),

        // Messages list
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            itemCount: _messages.length,
            itemBuilder: (context, index) {
              final m = _messages[index];
              final isUser = m['sender'] == 'user';
              return Align(
                alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isUser ? const Color(0xFF001C28) : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.04)),
                  ),
                  child: Text(
                    m['text'],
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isUser ? Colors.white : const Color(0xFF001C28),
                      height: 1.4,
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Input row
        Padding(
          padding: const EdgeInsets.only(left: 16, right: 16, bottom: 100, top: 10),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                    hintText: 'Ask AI Pediatrician...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(24))),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(TablerIcons.send),
                onPressed: () => _sendMessage(_controller.text),
              ),
            ],
          ),
        )
      ],
    );
  }
}

class KidsImmunizationContent extends StatefulWidget {
  const KidsImmunizationContent({super.key});

  @override
  State<KidsImmunizationContent> createState() => _KidsImmunizationContentState();
}

class _KidsImmunizationContentState extends State<KidsImmunizationContent> {
  final List<Map<String, dynamic>> _vaccines = [
    {'name': 'BCG (Tuberculosis)', 'cohort': 'Birth Dose', 'given': true},
    {'name': 'OPV-0 (Oral Polio)', 'cohort': 'Birth Dose', 'given': true},
    {'name': 'HepB-0 (Hepatitis B)', 'cohort': 'Birth Dose', 'given': true},
    {'name': 'Pentavalent-1', 'cohort': '6 Weeks cohort', 'given': true},
    {'name': 'Rotavirus-1', 'cohort': '6 Weeks cohort', 'given': false},
    {'name': 'PCV-1 (Pneumococcal)', 'cohort': '6 Weeks cohort', 'given': false},
    {'name': 'Pentavalent-2', 'cohort': '10 Weeks cohort', 'given': false},
    {'name': 'OPV-2', 'cohort': '10 Weeks cohort', 'given': false},
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 120),
      itemCount: _vaccines.length,
      itemBuilder: (context, index) {
        final v = _vaccines[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    v['name'],
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF001C28)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    v['cohort'],
                    style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Switch(
                value: v['given'],
                onChanged: (val) {
                  setState(() {
                    v['given'] = val;
                  });
                },
                activeColor: const Color(0xFF8BB436),
              ),
            ],
          ),
        );
      },
    );
  }
}

class KidsGrowthCurveContent extends StatefulWidget {
  const KidsGrowthCurveContent({super.key});

  @override
  State<KidsGrowthCurveContent> createState() => _KidsGrowthCurveContentState();
}

class _KidsGrowthCurveContentState extends State<KidsGrowthCurveContent> {
  int _activeType = 0; // 0: Weight, 1: Height

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 120),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () => setState(() => _activeType = 0),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _activeType == 0 ? const Color(0xFF001C28) : Colors.white,
                    foregroundColor: _activeType == 0 ? Colors.white : const Color(0xFF001C28),
                  ),
                  child: const Text('Weight Percentiles', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => setState(() => _activeType = 1),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _activeType == 1 ? const Color(0xFF001C28) : Colors.white,
                    foregroundColor: _activeType == 1 ? Colors.white : const Color(0xFF001C28),
                  ),
                  child: const Text('Height Percentiles', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Graph container
          Container(
            height: 260,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: _activeType == 0 
                ? const KidsWeightPercentileChart() 
                : const KidsHeightPercentileChart(),
          ),
          const SizedBox(height: 20),

          // Stats table details
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: const Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Current Weight', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('6.2 kg (50th Percentile)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
                Divider(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Current Height', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('61 cm (65th Percentile)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  ],
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}

class KidsWeightPercentileChart extends StatelessWidget {
  const KidsWeightPercentileChart({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(double.infinity, double.infinity),
      painter: KidsWeightChartPainter(),
    );
  }
}

class KidsWeightChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p50 = Paint()
      ..color = const Color(0xFF8BB436)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    final p5 = Paint()
      ..color = Colors.grey.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final p95 = Paint()
      ..color = Colors.grey.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final pBaby = Paint()
      ..color = const Color(0xFF0089C1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    final path5 = Path();
    final path50 = Path();
    final path95 = Path();
    final pathBaby = Path();

    path5.moveTo(0, size.height * 0.9);
    path50.moveTo(0, size.height * 0.75);
    path95.moveTo(0, size.height * 0.6);
    pathBaby.moveTo(0, size.height * 0.8);

    final points5 = [
      Offset(size.width * 0.25, size.height * 0.8),
      Offset(size.width * 0.5, size.height * 0.68),
      Offset(size.width * 0.75, size.height * 0.55),
      Offset(size.width, size.height * 0.45)
    ];

    final points50 = [
      Offset(size.width * 0.25, size.height * 0.62),
      Offset(size.width * 0.5, size.height * 0.48),
      Offset(size.width * 0.75, size.height * 0.35),
      Offset(size.width, size.height * 0.22)
    ];

    final points95 = [
      Offset(size.width * 0.25, size.height * 0.45),
      Offset(size.width * 0.5, size.height * 0.32),
      Offset(size.width * 0.75, size.height * 0.2),
      Offset(size.width, size.height * 0.08)
    ];

    final pointsBaby = [
      Offset(size.width * 0.25, size.height * 0.64),
      Offset(size.width * 0.5, size.height * 0.46),
    ];

    for (var p in points5) { path5.lineTo(p.dx, p.dy); }
    for (var p in points50) { path50.lineTo(p.dx, p.dy); }
    for (var p in points95) { path95.lineTo(p.dx, p.dy); }
    for (var p in pointsBaby) { pathBaby.lineTo(p.dx, p.dy); }

    canvas.drawPath(path5, p5);
    canvas.drawPath(path50, p50);
    canvas.drawPath(path95, p95);
    canvas.drawPath(pathBaby, pBaby);

    // Draw active dot
    final lastPt = pointsBaby.last;
    canvas.drawCircle(lastPt, 6, Paint()..color = const Color(0xFF0089C1));
    canvas.drawCircle(lastPt, 3, Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class KidsHeightPercentileChart extends StatelessWidget {
  const KidsHeightPercentileChart({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(double.infinity, double.infinity),
      painter: KidsHeightChartPainter(),
    );
  }
}

class KidsHeightChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p50 = Paint()
      ..color = const Color(0xFF8BB436)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    final p5 = Paint()
      ..color = Colors.grey.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final p95 = Paint()
      ..color = Colors.grey.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final pBaby = Paint()
      ..color = const Color(0xFF0089C1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    final path5 = Path();
    final path50 = Path();
    final path95 = Path();
    final pathBaby = Path();

    path5.moveTo(0, size.height * 0.85);
    path50.moveTo(0, size.height * 0.7);
    path95.moveTo(0, size.height * 0.55);
    pathBaby.moveTo(0, size.height * 0.7);

    final points5 = [
      Offset(size.width * 0.25, size.height * 0.72),
      Offset(size.width * 0.5, size.height * 0.58),
      Offset(size.width * 0.75, size.height * 0.44),
      Offset(size.width, size.height * 0.32)
    ];

    final points50 = [
      Offset(size.width * 0.25, size.height * 0.55),
      Offset(size.width * 0.5, size.height * 0.41),
      Offset(size.width * 0.75, size.height * 0.28),
      Offset(size.width, size.height * 0.16)
    ];

    final points95 = [
      Offset(size.width * 0.25, size.height * 0.38),
      Offset(size.width * 0.5, size.height * 0.24),
      Offset(size.width * 0.75, size.height * 0.12),
      Offset(size.width, size.height * 0.02)
    ];

    final pointsBaby = [
      Offset(size.width * 0.25, size.height * 0.52),
      Offset(size.width * 0.5, size.height * 0.35),
    ];

    for (var p in points5) { path5.lineTo(p.dx, p.dy); }
    for (var p in points50) { path50.lineTo(p.dx, p.dy); }
    for (var p in points95) { path95.lineTo(p.dx, p.dy); }
    for (var p in pointsBaby) { pathBaby.lineTo(p.dx, p.dy); }

    canvas.drawPath(path5, p5);
    canvas.drawPath(path50, p50);
    canvas.drawPath(path95, p95);
    canvas.drawPath(pathBaby, pBaby);

    // Draw active dot
    final lastPt = pointsBaby.last;
    canvas.drawCircle(lastPt, 6, Paint()..color = const Color(0xFF0089C1));
    canvas.drawCircle(lastPt, 3, Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class KidsMilestonesContent extends StatefulWidget {
  const KidsMilestonesContent({super.key});

  @override
  State<KidsMilestonesContent> createState() => _KidsMilestonesContentState();
}

class _KidsMilestonesContentState extends State<KidsMilestonesContent> {
  final List<Map<String, dynamic>> _milestones = [
    {'month': 2, 'text': 'Responsive social smiles & looks', 'checked': true},
    {'month': 2, 'text': 'Vocalizes repeating simple cooing noises', 'checked': true},
    {'month': 3, 'text': 'Steady head control when held upright', 'checked': true},
    {'month': 4, 'text': 'Reaches for and grasps lightweight toys', 'checked': false},
    {'month': 6, 'text': 'Rolls from tummy to back independently', 'checked': false},
    {'month': 6, 'text': 'Sits briefly with hands supporting balance', 'checked': false},
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 120),
      itemCount: _milestones.length,
      itemBuilder: (context, index) {
        final m = _milestones[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
          ),
          child: CheckboxListTile(
            title: Text(
              m['text'],
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
            ),
            subtitle: Text('Target: Month ${m['month']}', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
            value: m['checked'],
            onChanged: (val) {
              setState(() {
                m['checked'] = val;
              });
            },
            activeColor: const Color(0xFF8BB436),
            controlAffinity: ListTileControlAffinity.leading,
            contentPadding: EdgeInsets.zero,
          ),
        );
      },
    );
  }
}

class KidsAcademyContent extends StatefulWidget {
  const KidsAcademyContent({super.key});

  @override
  State<KidsAcademyContent> createState() => _KidsAcademyContentState();
}

class _KidsAcademyContentState extends State<KidsAcademyContent> {
  final List<Map<String, String>> _articles = [
    {'title': 'Infant Nutrition & Feeding Guidelines', 'desc': 'Best practices on breastfeeding schedules, feeding volumes, and when to introduce solids.'},
    {'title': 'Safe Sleep & Preventing SIDS', 'desc': 'Detailed pediatric checklists for sleep environments, swaddling safety, and optimal sleep times.'},
    {'title': 'Developmental Play for 0-6 Months', 'desc': 'Sensory and motor activities to promote early brain growth, cognitive logic, and motor grip.'}
  ];

  int _selectedQuizAnswer = -1;
  bool _quizSubmitted = false;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 120),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Articles
          const Text(
            'Recommended Articles',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          ..._articles.map((art) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(art['title']!, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF001C28))),
                  const SizedBox(height: 6),
                  Text(art['desc']!, style: const TextStyle(fontSize: 11, color: Colors.grey, height: 1.4, fontWeight: FontWeight.bold)),
                ],
              ),
            );
          }),
          const SizedBox(height: 24),

          // Mini Quiz
          const Text(
            'Milestones Mini Quiz',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Question: At what age do babies typically sit up unsupported?',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                const SizedBox(height: 14),
                _buildQuizOption(0, '3 - 4 Months'),
                _buildQuizOption(1, '6 - 8 Months'),
                _buildQuizOption(2, '10 - 12 Months'),
                const SizedBox(height: 16),
                if (!_quizSubmitted)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _selectedQuizAnswer == -1 ? null : () {
                        setState(() {
                          _quizSubmitted = true;
                        });
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF001C28)),
                      child: const Text('Submit Answer', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  )
                else ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _selectedQuizAnswer == 1 ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _selectedQuizAnswer == 1 
                          ? 'Correct! Most infants develop trunk stability and sit unsupported between 6 to 8 months.' 
                          : 'Incorrect. Try reviewing the developmental play article above!',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: _selectedQuizAnswer == 1 ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _selectedQuizAnswer = -1;
                        _quizSubmitted = false;
                      });
                    },
                    child: const Text('Try Again', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0089C1))),
                  ),
                ]
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildQuizOption(int idx, String label) {
    final isSelected = _selectedQuizAnswer == idx;
    return GestureDetector(
      onTap: _quizSubmitted ? null : () => setState(() => _selectedQuizAnswer = idx),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFDDEEF3) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? const Color(0xFF0089C1) : const Color(0xFF1E293B).withOpacity(0.06),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? TablerIcons.circle_check : TablerIcons.circle,
              color: isSelected ? const Color(0xFF0089C1) : Colors.grey,
              size: 16,
            ),
            const SizedBox(width: 10),
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 09. AHNARA CIRCLE FEED PAGE (CI.1 - CI.9)
// ==========================================
class AhnaraCircleFeedPage extends StatefulWidget {
  final int activeWorkspaceIndex;
  final String currentUserName;
  const AhnaraCircleFeedPage({
    super.key,
    required this.activeWorkspaceIndex,
    required this.currentUserName,
  });

  @override
  State<AhnaraCircleFeedPage> createState() => _AhnaraCircleFeedPageState();
}

class _AhnaraCircleFeedPageState extends State<AhnaraCircleFeedPage> {
  int _activeCategoryIndex = 0;
  bool _isPlayingAudio = false;
  bool _peerMatched = false;
  bool _isModeratorView = false;
  bool _hasRSVP = false;
  int _rsvpCount = 42;

  // Family Link Permissions state
  bool _permMaternal = true;
  bool _permPediatric = true;
  bool _permGeriatric = false;
  bool _permLady = false;
  bool _permGirlie = false;

  final List<Map<String, dynamic>> _mockPosts = [
    {
      'author': 'Sarah Jenkins (Mama)',
      'workspace': 0,
      'time': '10m ago',
      'text': 'Experiencing severe morning sickness in Gestation Week 9. Any advice on natural remedies or should I consult my doctor?',
      'nlpWarning': false,
      'upvotes': 12,
      'verifiedAnswer': 'Dr. Adenuga (Pediatrician): Focus on small, dry snacks like ginger biscuits or crackers. Sip water slowly between meals.',
      'expertBadge': true,
    },
    {
      'author': 'Liam Carter (Kids Parent)',
      'workspace': 1,
      'time': '1h ago',
      'text': 'My 4-month-old is sleeping 12 hours straight at night. Is this normal or should I wake them up to feed?',
      'nlpWarning': false,
      'upvotes': 8,
      'verifiedAnswer': 'Dr. Adenuga (Pediatrician): If their weight gain is normal and they feed well during the day, it is safe to let them sleep.',
      'expertBadge': true,
    },
    {
      'author': 'Clara Rogers (Companion)',
      'workspace': 2,
      'time': '3h ago',
      'text': 'My father is showing sudden confusion today. Has anyone else noticed high-risk scams targeting elders on SMS?',
      'nlpWarning': true,
      'upvotes': 22,
      'verifiedAnswer': null,
      'expertBadge': false,
    },
    {
      'author': 'Jane Doe (Girlie Profile)',
      'workspace': 4,
      'time': '5h ago',
      'text': 'Is it normal to feel pelvic cramps two days before first period starts? P.S. I locked my logs with PIN code.',
      'nlpWarning': false,
      'upvotes': 5,
      'verifiedAnswer': 'Nurse Clara (Clinician): Yes! Pre-period cramps are very common as muscles contract. Keep a warm pad handy.',
      'expertBadge': true,
    }
  ];

  final List<Map<String, dynamic>> _flaggedComments = [
    {
      'id': 'INC-482-104',
      'text': 'You should double your medication dose without consulting the GP, it cured my joint stiffness immediately.',
      'flagReason': 'Unverified Medical Advice',
      'strikes': 2,
    },
    {
      'id': 'INC-204-859',
      'text': 'Adolescents should avoid seeking clinic help for cramps, just use home herbal remedies.',
      'flagReason': 'Harassment / Medical Spam',
      'strikes': 1,
    }
  ];

  @override
  void initState() {
    super.initState();
    _activeCategoryIndex = widget.activeWorkspaceIndex;
  }

  Color _getThemeColor() {
    switch (_activeCategoryIndex) {
      case 0: return const Color(0xFF8BB436);
      case 1: return const Color(0xFF0089C1);
      case 2: return const Color(0xFF6366F1);
      case 3: return const Color(0xFFE11D48);
      case 4: return const Color(0xFFE572A1);
      default: return const Color(0xFF001C28);
    }
  }

  String _getCategoryName(int idx) {
    switch (idx) {
      case 0: return "Maternal Care";
      case 1: return "Newborn Care";
      case 2: return "Geriatric Care";
      case 3: return "Lady Care";
      case 4: return "Adolescent Care";
      default: return "";
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = _getThemeColor();

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF001C28)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          _isModeratorView ? 'Community Moderation Desk' : 'Ahnara Circle Feed',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isModeratorView ? Icons.visibility : Icons.admin_panel_settings,
              color: themeColor,
            ),
            onPressed: () {
              setState(() {
                _isModeratorView = !_isModeratorView;
              });
            },
          )
        ],
      ),
      body: _isModeratorView ? _buildModerationDesk() : _buildCommunityFeed(),
    );
  }

  Widget _buildCommunityFeed() {
    final themeColor = _getThemeColor();
    return Column(
      children: [
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: [
                const SizedBox(width: 16),
                for (int i = 0; i < 5; i++) ...[
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _activeCategoryIndex = i;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: _activeCategoryIndex == i ? themeColor : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: _activeCategoryIndex == i ? themeColor : Colors.transparent,
                        ),
                      ),
                      child: Text(
                        _getCategoryName(i),
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.bold,
                          color: _activeCategoryIndex == i ? Colors.white : const Color(0xFF001C28),
                        ),
                      ),
                    ),
                  )
                ]
              ],
            ),
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            children: [
              _buildExpertQACard(),
              const SizedBox(height: 12),
              _buildPeerMatcherCard(),
              const SizedBox(height: 12),
              _buildRSVPCard(),
              const SizedBox(height: 12),
              _buildFamilyLinkCard(),
              const SizedBox(height: 16),
              const Text(
                'LATEST COMMUNITY THREADS',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
              ),
              const SizedBox(height: 8),
              ..._mockPosts
                  .where((post) => post['workspace'] == _activeCategoryIndex)
                  .map((post) => _buildPostItem(post)),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildExpertQACard() {
    final themeColor = _getThemeColor();
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
      ),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: themeColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Icon(Icons.star, color: themeColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'EXPERT-LED Q&A OF THE DAY',
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Dr. Adenuga [Pediatrician]',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: themeColor),
                      ),
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Q: How long can infant formula sit in the fridge or at room temperature?',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(
                      _isPlayingAudio ? Icons.pause_circle_filled : Icons.play_circle_filled,
                      color: themeColor,
                      size: 28,
                    ),
                    onPressed: () {
                      setState(() {
                        _isPlayingAudio = !_isPlayingAudio;
                      });
                    },
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Recorded audio response',
                          style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          _isPlayingAudio ? 'Playing clinician reply... (2m 14s)' : 'Tap to listen to clinician reply',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildPeerMatcherCard() {
    final themeColor = _getThemeColor();
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
      ),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'PEER-TO-PEER MATCHING (CI · 03)',
                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
                Icon(Icons.people_alt, color: Colors.orange, size: 16),
              ],
            ),
            const SizedBox(height: 8),
            if (!_peerMatched) ...[
              const Text(
                'Facing a complex health challenge? Match with peers matching your criteria for private counseling.',
                style: TextStyle(fontSize: 11.5, color: Color(0xFF001C28), height: 1.3),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _peerMatched = true;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: themeColor,
                    foregroundColor: Colors.white,
                    shape: const StadiumBorder(),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                  child: const Text(
                    'Setup Match (Simulate)',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ] else ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFD1FAE5)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      alignment: Alignment.center,
                      child: const Text('👩', style: TextStyle(fontSize: 20)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            '98% MATCH FOUND',
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.green),
                          ),
                          const Text(
                            'Tyra Dhillon (trimester 3)',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                          ),
                          const Text(
                            'Shared milestone: Twin pregnancy plan',
                            style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chat_bubble, color: Colors.green),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Gate opened. Direct private chat enabled!')),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => setState(() => _peerMatched = false),
                    child: const Text('Reset Matcher', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
                  ),
                ],
              )
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildRSVPCard() {
    final themeColor = _getThemeColor();
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
      ),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'COMMUNITY SEMINARS & RSVPS',
                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
                Icon(Icons.video_camera_back, color: Color(0xFF0089C1), size: 16),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Event: Newborn Nutrition & Feeding Workshop',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
            ),
            const Text(
              'Time: Saturday, 10:00 AM • Location: Clinic A / In-App Stream',
              style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$_rsvpCount members attending',
                  style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      if (_hasRSVP) {
                        _hasRSVP = false;
                        _rsvpCount--;
                      } else {
                        _hasRSVP = true;
                        _rsvpCount++;
                      }
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _hasRSVP ? Colors.grey : themeColor,
                    foregroundColor: Colors.white,
                    shape: const StadiumBorder(),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  child: Text(
                    _hasRSVP ? 'RSVP\'d (Cancel)' : 'Attend RSVP',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildFamilyLinkCard() {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
      ),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'FAMILY CIRCLE LINK (CI · 07)',
                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
                Icon(Icons.family_restroom, color: Colors.indigo, size: 16),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Set dynamic sharing permissions for linked family members:',
              style: TextStyle(fontSize: 11.5, color: Color(0xFF001C28), height: 1.3),
            ),
            const SizedBox(height: 12),
            _buildPermissionRow('Share Maternal progress logs', _permMaternal, (v) => setState(() => _permMaternal = v)),
            _buildPermissionRow('Share Pediatric growth charts', _permPediatric, (v) => setState(() => _permPediatric = v)),
            _buildPermissionRow('Share Seniors Scam Shield flags', _permGeriatric, (v) => setState(() => _permGeriatric = v)),
            _buildPermissionRow('Share Lady fertility predictions', _permLady, (v) => setState(() => _permLady = v)),
            _buildPermissionRow('Share Girlie passcode protection status', _permGirlie, (v) => setState(() => _permGirlie = v)),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('WhatsApp invitation link generated and copied to clipboard!')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF001C28),
                  foregroundColor: Colors.white,
                  shape: const StadiumBorder(),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                ),
                icon: const Icon(Icons.share, size: 14),
                label: const Text('Generate Invite Link', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildPermissionRow(String title, bool val, Function(bool) onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
            ),
          ),
          Switch(
            value: val,
            activeColor: _getThemeColor(),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildPostItem(Map<String, dynamic> post) {
    final themeColor = _getThemeColor();
    final isNlpWarning = post['nlpWarning'] ?? false;
    final hasVerifiedAns = post['verifiedAnswer'] != null;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                post['author'],
                style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
              ),
              Text(
                post['time'],
                style: const TextStyle(fontSize: 9.5, color: Colors.grey, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            post['text'],
            style: const TextStyle(fontSize: 12, color: Color(0xFF001C28), height: 1.4),
          ),
          const SizedBox(height: 10),
          if (isNlpWarning) ...[
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF7ED),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFFFEDD5)),
              ),
              child: Row(
                children: [
                  Icon(TablerIcons.alert_triangle, color: Colors.orange.shade700, size: 16),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Warning: Medical claims flagged for review by moderators.',
                      style: TextStyle(fontSize: 10.5, color: Color(0xFF9A3412), fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
          ],
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.thumb_up, size: 12, color: themeColor),
                  const SizedBox(width: 4),
                  Text(
                    '${post['upvotes']} Upvotes',
                    style: const TextStyle(fontSize: 10.5, color: Colors.grey, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () {
                  _showAskClinicianDialog(post);
                },
                child: Row(
                  children: [
                    Icon(Icons.lock, size: 12, color: themeColor),
                    const SizedBox(width: 4),
                    Text(
                      'Ask Clinician',
                      style: TextStyle(fontSize: 10.5, color: themeColor, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              )
            ],
          ),
          if (hasVerifiedAns) ...[
            const Divider(height: 20),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.verified, color: themeColor, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      post['verifiedAnswer'],
                      style: const TextStyle(fontSize: 11, color: Color(0xFF001C28), height: 1.4, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ]
        ],
      ),
    );
  }

  void _showAskClinicianDialog(Map<String, dynamic> post) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Text('Ask Clinician Gateway', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Do you want to escalate this public question into a secure, private Consult triage ticket with Dr. Adenuga?',
                style: TextStyle(fontSize: 12, height: 1.4),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
                child: Text(
                  post['text'],
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 11, color: Colors.grey, fontStyle: FontStyle.italic),
                ),
              ),
              const SizedBox(height: 12),
              const Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.green, size: 14),
                  SizedBox(width: 6),
                  Text('Standard Telehealth coverage applied', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                ],
              )
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Ticket created! Escalated to Consult Triage Queue.')),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: _getThemeColor(),
                foregroundColor: Colors.white,
                shape: const StadiumBorder(),
              ),
              child: const Text('Escalate', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  Widget _buildModerationDesk() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF2F2),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFCA5A5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.gpp_bad, color: Colors.red, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'AI MODERATION LOGS',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFDC2626)),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'AI natural language filters automatically flagged ${_flaggedComments.length} comments containing unverified advice today.',
                style: const TextStyle(fontSize: 11, color: Colors.black54, height: 1.3),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'PENDING INCIDENT REPORTS',
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
        ),
        const SizedBox(height: 8),
        for (var flag in _flaggedComments) ...[
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        flag['flagReason'],
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.red.shade900),
                      ),
                    ),
                    Text(
                      'ID: ${flag['id']}',
                      style: const TextStyle(fontSize: 9, color: Colors.grey, fontFamily: 'Courier'),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  '"${flag['text']}"',
                  style: const TextStyle(fontSize: 11.5, color: Color(0xFF001C28), fontStyle: FontStyle.italic),
                ),
                const SizedBox(height: 8),
                Text(
                  'User Strikes: ${flag['strikes']} / 3',
                  style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _flaggedComments.remove(flag);
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Comment approved and warning cleared.')),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        shape: const StadiumBorder(),
                        side: const BorderSide(color: Colors.grey),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      child: const Text('Approve', style: TextStyle(fontSize: 10.5, color: Colors.grey, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _flaggedComments.remove(flag);
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Post deleted. User strike issued.')),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      child: const Text('Issue Strike', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                    ),
                  ],
                )
              ],
            ),
          )
        ],
      ],
    );
  }
}

// ==========================================
// 10. FAMILY DASHBOARD PAGE
// ==========================================
class FamilyDashboardPage extends StatefulWidget {
  final int activeWorkspaceIndex;
  final String currentUserName;
  const FamilyDashboardPage({
    super.key,
    required this.activeWorkspaceIndex,
    required this.currentUserName,
  });

  @override
  State<FamilyDashboardPage> createState() => _FamilyDashboardPageState();
}

class _FamilyDashboardPageState extends State<FamilyDashboardPage> {
  String _wellbeingStatus = "green"; // green, amber, red
  int _heartRate = 72;
  int _steps = 8402;
  bool _scamAlertActive = true;

  // Medication compliance heatmap state (7 days, 4 intervals)
  final List<List<bool>> _medsMatrix = [
    [true, true, true, false],  // Mon
    [true, true, true, true],   // Tue
    [true, true, false, false], // Wed
    [true, true, true, true],   // Thu
    [true, true, true, false],  // Fri
    [true, false, false, false],// Sat
    [true, true, true, true],   // Sun
  ];

  Color _getStatusColor(String s) {
    if (s == "green") return const Color(0xFF10B981);
    if (s == "amber") return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(_wellbeingStatus);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF001C28)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Family Wellbeing Hub',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        physics: const BouncingScrollPhysics(),
        children: [
          Card(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            elevation: 0,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Text(
                    'ELDER WELLBEING STATUS SUMMARY',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            if (_wellbeingStatus == "green") {
                              _wellbeingStatus = "amber";
                            } else if (_wellbeingStatus == "amber") {
                              _wellbeingStatus = "red";
                            } else {
                              _wellbeingStatus = "green";
                            }
                          });
                        },
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: statusColor, width: 6),
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            _wellbeingStatus == "green" 
                                ? Icons.check_circle_outline 
                                : _wellbeingStatus == "amber" 
                                ? Icons.warning_amber_rounded 
                                : Icons.error_outline,
                            color: statusColor,
                            size: 32,
                          ),
                        ),
                      ),
                      const SizedBox(width: 24),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _wellbeingStatus == "green"
                                  ? 'Margaret Dhillon is Safe'
                                  : _wellbeingStatus == "amber"
                                  ? 'Check-In Pending'
                                  : 'Emergency Warning Active',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: statusColor),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _wellbeingStatus == "green"
                                  ? 'All daily check-ins normal, medications taken, GPS geofence clear.'
                                  : _wellbeingStatus == "amber"
                                  ? 'Evening check-in delayed by 15 mins. Trusted circle notified.'
                                  : 'SOS Triggered! Location: 22 Medical Center Drive. Clinicians dispatched.',
                              style: TextStyle(fontSize: 11, color: Colors.grey.shade700, height: 1.3, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (_scamAlertActive) ...[
            Card(
              color: const Color(0xFFFEF2F2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: Color(0xFFFCA5A5)),
              ),
              elevation: 0,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.shield_outlined, color: Colors.red, size: 18),
                        SizedBox(width: 8),
                        Text(
                          'SCAM SHIELD ALERT (CRITICAL)',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.red),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'AI Scam Shield flagged a suspicious SMS received by Margaret: "URGENT: Your bank code will expire in 2 hours. Click here to verify."',
                      style: TextStyle(fontSize: 11.5, color: Color(0xFF991B1B), height: 1.3, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        OutlinedButton(
                          onPressed: () {
                            setState(() {
                              _scamAlertActive = false;
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Warning dismissed. Sender blocked.')),
                            );
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.red),
                            shape: const StadiumBorder(),
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                          ),
                          child: const Text('Dismiss & Block', style: TextStyle(fontSize: 10.5, color: Colors.red, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Initiating direct secure call with Margaret.')),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                            shape: const StadiumBorder(),
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                          ),
                          icon: const Icon(Icons.phone, size: 12),
                          label: const Text('Call Margaret', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                        )
                      ],
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
          Card(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            elevation: 0,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'MEDICATION COMPLIANCE HEATMAP',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                      ),
                      Icon(Icons.apps, color: Colors.grey, size: 16),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      for (int dayIdx = 0; dayIdx < 7; dayIdx++) ...[
                        Column(
                          children: [
                            Text(
                              ['M', 'T', 'W', 'T', 'F', 'S', 'S'][dayIdx],
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                            ),
                            const SizedBox(height: 6),
                            for (int intIdx = 0; intIdx < 4; intIdx++) ...[
                              Container(
                                width: 28,
                                height: 28,
                                margin: const EdgeInsets.only(bottom: 4),
                                decoration: BoxDecoration(
                                  color: _medsMatrix[dayIdx][intIdx] 
                                      ? const Color(0xFF10B981) 
                                      : const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(
                                    color: _medsMatrix[dayIdx][intIdx] 
                                        ? const Color(0xFF10B981) 
                                        : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                alignment: Alignment.center,
                                child: _medsMatrix[dayIdx][intIdx]
                                    ? const Icon(Icons.check, size: 14, color: Colors.white)
                                    : null,
                              )
                            ],
                          ],
                        )
                      ]
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Icon(Icons.check_circle, color: Color(0xFF10B981), size: 14),
                      SizedBox(width: 6),
                      Text('85% Adherence for this week', style: TextStyle(fontSize: 10.5, color: Colors.grey, fontWeight: FontWeight.bold)),
                    ],
                  )
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            elevation: 0,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'WEARABLE TELEMETRY (APPLE WATCH)',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(TablerIcons.activity, color: Colors.blue, size: 18),
                              const SizedBox(height: 8),
                              const Text('HEART RATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.blue)),
                              const SizedBox(height: 2),
                              Text('$_heartRate BPM', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF7ED),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.directions_walk, color: Colors.orange, size: 18),
                              const SizedBox(height: 8),
                              const Text('STEPS TODAY', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.orange)),
                              const SizedBox(height: 2),
                              Text('$_steps', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF001C28))),
                            ],
                          ),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
            ),
            elevation: 0,
            child: const Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'RECENT CAREGIVER GPS LOGS',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                  ),
                  SizedBox(height: 12),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      backgroundColor: Color(0xFFF1F5F9),
                      child: Icon(Icons.person, color: Color(0xFF001C28)),
                    ),
                    title: Text(
                      'Nurse Jevinro K. checked in',
                      style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                    ),
                    subtitle: Text(
                      'Arrived: 10:02 AM • Left: 11:30 AM • GPS Verified',
                      style: TextStyle(fontSize: 10.5, color: Colors.grey, fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              ),
            ),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

// ==========================================
// 11. AHNARA ACADEMY PAGE (DYNAMIC ACADEMY)
// ==========================================
class AhnaraAcademyPage extends StatefulWidget {
  final int activeWorkspaceIndex;
  final String currentUserName;
  const AhnaraAcademyPage({
    super.key,
    required this.activeWorkspaceIndex,
    required this.currentUserName,
  });

  @override
  State<AhnaraAcademyPage> createState() => _AhnaraAcademyPageState();
}

class _AhnaraAcademyPageState extends State<AhnaraAcademyPage> {
  int _activeCategoryIndex = 0;
  int _activeTabIndex = 0;
  bool _isPlayingAudio = false;
  int _activeLectureIndex = 0;

  @override
  void initState() {
    super.initState();
    _activeCategoryIndex = widget.activeWorkspaceIndex;
  }

  Color _getThemeColor() {
    switch (_activeCategoryIndex) {
      case 0: return const Color(0xFF8BB436); // Mama
      case 1: return const Color(0xFF0089C1); // Kids
      case 2: return const Color(0xFF6366F1); // Seniors
      case 3: return const Color(0xFFE11D48); // Lady
      case 4: return const Color(0xFFE572A1); // Girlie
      default: return const Color(0xFF001C28);
    }
  }

  String _getAcademyTitle() {
    switch (_activeCategoryIndex) {
      case 0: return "Maternal Care Academy";
      case 1: return "Pediatric Parenting Academy";
      case 2: return "Elder Longevity Academy";
      case 3: return "Lady Wellness Academy";
      case 4: return "Teen Growth Academy";
      default: return "Ahnara Academy";
    }
  }

  List<String> _getTabs() {
    switch (_activeCategoryIndex) {
      case 0: return ["Self-Care", "Pregnancy Nutrition"];
      case 1: return ["First-Aid", "Infant Feeding"];
      case 2: return ["Physical Mobility", "Memory Support"];
      case 3: return ["Cycle Workouts", "Hormonal Nutrition"];
      case 4: return ["Body Image", "Life Skills"];
      default: return ["General", "Outlines"];
    }
  }

  List<Map<String, String>> _getCourses() {
    if (_activeCategoryIndex == 0) { // Mama
      if (_activeTabIndex == 0) {
        return [
          {'title': 'Third Trimester Breathing', 'desc': 'Techniques to manage diaphragmatic pressure and optimize oxygenation during labor.', 'duration': '15 min'},
          {'title': 'Pelvic Floor Preparation', 'desc': 'Exercises to build elasticity and strength for natural delivery.', 'duration': '20 min'},
        ];
      } else {
        return [
          {'title': 'Iron & Folate Nutrition', 'desc': 'Aligning micronutrients with gestational developments to support fetal blood production.', 'duration': '10 min'},
          {'title': 'Gestational Glucose Control', 'desc': 'Dietary guidelines to prevent insulin spikes and balance energy levels.', 'duration': '12 min'},
        ];
      }
    } else if (_activeCategoryIndex == 1) { // Kids
      if (_activeTabIndex == 0) {
        return [
          {'title': 'Pediatric Choking Response', 'desc': 'Step-by-step guidance on back blows and chest thrusts for infants.', 'duration': '8 min'},
          {'title': 'Managing Childhood Fevers', 'desc': 'When to use cooling compresses vs calling a pediatrician.', 'duration': '12 min'},
        ];
      } else {
        return [
          {'title': 'Breastfeeding Latch Tips', 'desc': 'Positioning strategies to ensure efficient milk transfer and comfort.', 'duration': '15 min'},
          {'title': 'Introducing Solid Foods', 'desc': 'When and how to safely start purees and baby-led weaning.', 'duration': '10 min'},
        ];
      }
    } else if (_activeCategoryIndex == 2) { // Seniors
      if (_activeTabIndex == 0) {
        return [
          {'title': 'Safe Transfers & Fall Prevention', 'desc': 'Techniques to help seniors rise safely from chairs or beds.', 'duration': '18 min'},
          {'title': 'Seated Mobility Drills', 'desc': 'Gentle stretching to maintain joint flexibility and leg strength.', 'duration': '14 min'},
        ];
      } else {
        return [
          {'title': 'Cognitive Adaptability Games', 'desc': 'Understanding cognitive baselines and using puzzles to track decline.', 'duration': '12 min'},
          {'title': 'Dementia Home Safety', 'desc': 'Managing room layouts and schedules to reduce confusion and anxiety.', 'duration': '20 min'},
        ];
      }
    } else if (_activeCategoryIndex == 3) { // Lady
      if (_activeTabIndex == 0) {
        return [
          {'title': 'Follicular Phase Strength', 'desc': 'Maximize your estrogen spike with high-intensity strength training.', 'duration': '25 min'},
          {'title': 'Luteal Phase Yoga Flow', 'desc': 'Gentle stretches to calm the nervous system during progesterone peaks.', 'duration': '18 min'},
        ];
      } else {
        return [
          {'title': 'Prostaglandins & Cramps', 'desc': 'Learn how magnesium and omega-3s reduce uterine discomfort.', 'duration': '6 min'},
          {'title': 'Menopause Bone Density', 'desc': 'Understanding the essential role of Calcium and D3 during estrogen drop.', 'duration': '9 min'},
        ];
      }
    } else { // Girlie
      if (_activeTabIndex == 0) {
        return [
          {'title': 'Body Changes & Confidence', 'desc': 'Navigating puberty growth spurts and building self-image.', 'duration': '10 min'},
          {'title': 'Resisting Social Media Pressures', 'desc': 'Critical media literacy to protect young self-worth.', 'duration': '14 min'},
        ];
      } else {
        return [
          {'title': 'Menstrual Hygiene Basics', 'desc': 'How to track periods, log symptoms, and manage flow comfortably.', 'duration': '12 min'},
          {'title': 'Healthy Screen Time Balance', 'desc': 'Tips for balancing active outdoors time with digital coaching.', 'duration': '8 min'},
        ];
      }
    }
  }

  List<Map<String, String>> _getAudioLectures() {
    if (_activeCategoryIndex == 2) { // Seniors
      return [
        {'title': 'Understanding Alzheimer Symptoms', 'speaker': 'Dr. Marcus Vance', 'duration': '7 min'},
        {'title': 'Hydration Signals in Seniors', 'speaker': 'Nurse Clara Lopez', 'duration': '5 min'},
      ];
    } else if (_activeCategoryIndex == 3) { // Lady
      return [
        {'title': 'Estrogen & Metabolic Health', 'speaker': 'Dr. Alanna Patel', 'duration': '6 min'},
        {'title': 'Bone Mineral Density decline', 'speaker': 'Prof. Chloe Vance', 'duration': '9 min'},
      ];
    } else if (_activeCategoryIndex == 4) { // Girlie
      return [
        {'title': 'Body Positivity & Hormones', 'speaker': 'Coach Diana Reed', 'duration': '8 min'},
        {'title': 'Balanced Skincare Habits', 'speaker': 'Dermatologist Sarah Lee', 'duration': '5 min'},
      ];
    } else { // Mama / Kids
      return [
        {'title': 'Nutrition Essentials for Embryos', 'speaker': 'Dr. Adenuga', 'duration': '10 min'},
        {'title': 'Postnatal Care Routines', 'speaker': 'Midwife Jevinro K.', 'duration': '12 min'},
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = _getThemeColor();
    final tabs = _getTabs();
    final courses = _getCourses();
    final lectures = _getAudioLectures();
    
    if (_activeLectureIndex >= lectures.length) {
      _activeLectureIndex = 0;
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF001C28)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          _getAcademyTitle(),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
        ),
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: [
                  const SizedBox(width: 16),
                  for (int i = 0; i < 5; i++) ...[
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _activeCategoryIndex = i;
                          _activeTabIndex = 0;
                          _activeLectureIndex = 0;
                          _isPlayingAudio = false;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: _activeCategoryIndex == i ? _getThemeColor() : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          ["Mama", "Kids", "Seniors", "Lady", "Girlie"][i],
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.bold,
                            color: _activeCategoryIndex == i ? Colors.white : const Color(0xFF001C28),
                          ),
                        ),
                      ),
                    )
                  ]
                ],
              ),
            ),
          ),
          Container(
            color: Colors.white,
            padding: const EdgeInsets.only(bottom: 12, left: 16, right: 16),
            child: Row(
              children: [
                for (int tIdx = 0; tIdx < tabs.length; tIdx++) ...[
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _activeTabIndex = tIdx;
                        });
                      },
                      child: Container(
                        margin: EdgeInsets.only(right: tIdx == 0 ? 8 : 0, left: tIdx == 1 ? 8 : 0),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _activeTabIndex == tIdx ? themeColor.withOpacity(0.12) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: _activeTabIndex == tIdx ? themeColor : const Color(0xFFE2E8F0),
                            width: 1.5,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          tabs[tIdx],
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: _activeTabIndex == tIdx ? themeColor : const Color(0xFF001C28),
                          ),
                        ),
                      ),
                    ),
                  )
                ]
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              physics: const BouncingScrollPhysics(),
              children: [
                Card(
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
                  ),
                  elevation: 0,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'FEATURED AUDIO LECTURE',
                          style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                lectures[_activeLectureIndex]['title']!,
                                style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Speaker: ${lectures[_activeLectureIndex]['speaker']!} • ${lectures[_activeLectureIndex]['duration']!}',
                                style: const TextStyle(fontSize: 10.5, color: Colors.grey, fontWeight: FontWeight.bold),
                              ),
                              const Divider(height: 24),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.arrow_back_ios, size: 14),
                                    onPressed: _activeLectureIndex == 0 ? null : () {
                                      setState(() {
                                        _activeLectureIndex--;
                                        _isPlayingAudio = false;
                                      });
                                    },
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        _isPlayingAudio = !_isPlayingAudio;
                                      });
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(color: themeColor, shape: BoxShape.circle),
                                      child: Icon(
                                        _isPlayingAudio ? Icons.pause : Icons.play_arrow,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.arrow_forward_ios, size: 14),
                                    onPressed: _activeLectureIndex == lectures.length - 1 ? null : () {
                                      setState(() {
                                        _activeLectureIndex++;
                                        _isPlayingAudio = false;
                                      });
                                    },
                                  ),
                                ],
                              )
                            ],
                          ),
                        ),
                        if (_isPlayingAudio) ...[
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.volume_up, color: themeColor, size: 14),
                              const SizedBox(width: 6),
                              Text('Playing audio track stream...', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: themeColor)),
                            ],
                          )
                        ]
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'AVAILABLE LESSONS & COURSES',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                ),
                const SizedBox(height: 8),
                for (var course in courses) ...[
                  Card(
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                      side: BorderSide(color: const Color(0xFF1E293B).withOpacity(0.06)),
                    ),
                    elevation: 0,
                    margin: const EdgeInsets.only(bottom: 10),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                course['title']!,
                                style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF001C28)),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                                child: Text(course['duration']!, style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
                              )
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            course['desc']!,
                            style: const TextStyle(fontSize: 11.5, color: Colors.black54, height: 1.35),
                          ),
                          const Divider(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              ElevatedButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Starting lesson: "${course['title']!}"')),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF001C28),
                                  foregroundColor: Colors.white,
                                  shape: const StadiumBorder(),
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                ),
                                child: const Text('Start Lesson', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                              )
                            ],
                          )
                        ],
                      ),
                    ),
                  )
                ],
                Card(
                  color: themeColor.withOpacity(0.05),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: BorderSide(color: themeColor.withOpacity(0.12)),
                  ),
                  elevation: 0,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        Icon(Icons.verified, color: themeColor, size: 24),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('VERIFIED BADGE SYNC', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                              const SizedBox(height: 2),
                              Text(
                                _activeCategoryIndex == 2
                                    ? "Respite care certificate synced to family caregivers."
                                    : "Course completed. Synchronized with family health track.",
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: themeColor),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 80),
              ],
            ),
          )
        ],
      ),
    );
  }
}

// ==========================================
// TELEHEALTH SAFETY NET PATIENT CALL ROOM
// ==========================================
class PatientTelehealthCallPage extends StatefulWidget {
  final String doctorName;
  final String specialty;
  final String specialtyCode;

  const PatientTelehealthCallPage({
    super.key,
    required this.doctorName,
    required this.specialty,
    required this.specialtyCode,
  });

  @override
  State<PatientTelehealthCallPage> createState() => _PatientTelehealthCallPageState();
}

class _PatientTelehealthCallPageState extends State<PatientTelehealthCallPage> {
  bool _connected = false;
  bool _muted = false;
  bool _videoMuted = false;
  int _duration = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Simulate connection delay
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) {
        setState(() {
          _connected = true;
        });
        _timer = Timer.periodic(const Duration(seconds: 1), (t) {
          if (mounted) {
            setState(() {
              _duration++;
            });
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _formatDuration(int sec) {
    final m = sec ~/ 60;
    final s = sec % 60;
    return '$m:${s < 10 ? "0" : ""}$s';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF001C28),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'TELEMEDICINE CONSULT',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                      ),
                      Text(
                        widget.doctorName,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _connected ? _formatDuration(_duration) : 'Connecting...',
                      style: const TextStyle(color: Color(0xFFD4F475), fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                    ),
                  )
                ],
              ),
              const Expanded(child: SizedBox(height: 20)),
              // Call Video Screen
              Container(
                height: 320,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                clipBehavior: Clip.antiAlias,
                child: Stack(
                  children: [
                    Center(
                      child: !_connected
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const CircularProgressIndicator(color: Color(0xFF0089C1)),
                                const SizedBox(height: 16),
                                Text(
                                  'Verifying clinical spine link...',
                                  style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12, fontWeight: FontWeight.bold),
                                )
                              ],
                            )
                          : Container(
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [Color(0xFF001C28), Color(0xFF0D9488)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                              ),
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Container(
                                      width: 80,
                                      height: 80,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFFD4F475),
                                        shape: BoxShape.circle,
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        widget.doctorName.split(" ").map((n) => n[0]).join(""),
                                        style: const TextStyle(color: Color(0xFF001C28), fontSize: 24, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(widget.doctorName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                                    Text(widget.specialty, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                    ),
                    // Local Selfie PIP Overlay
                    if (_connected)
                      Positioned(
                        bottom: 16,
                        right: 16,
                        child: Container(
                          width: 80,
                          height: 110,
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white10),
                          ),
                          child: Center(
                            child: _videoMuted
                                ? const Icon(Icons.videocam_off, color: Colors.grey, size: 20)
                                : const Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.person, color: Colors.white30, size: 24),
                                      SizedBox(height: 4),
                                      Text('Selfie Feed', style: TextStyle(color: Colors.white30, fontSize: 8)),
                                    ],
                                  ),
                          ),
                        ),
                      )
                  ],
                ),
              ),
              const Expanded(child: SizedBox(height: 20)),
              // Controls Deck
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: Icon(_muted ? Icons.mic_off : Icons.mic),
                    color: _muted ? Colors.red : Colors.white,
                    onPressed: () {
                      setState(() {
                        _muted = !_muted;
                      });
                    },
                  ),
                  const SizedBox(width: 24),
                  IconButton(
                    icon: Icon(_videoMuted ? Icons.videocam_off : Icons.videocam),
                    color: _videoMuted ? Colors.red : Colors.white,
                    onPressed: () {
                      setState(() {
                        _videoMuted = !_videoMuted;
                      });
                    },
                  ),
                  const SizedBox(width: 24),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(16),
                    ),
                    child: const Icon(Icons.call_end),
                  )
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

