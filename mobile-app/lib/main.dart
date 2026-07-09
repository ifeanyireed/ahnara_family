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
                        _isKidsLogin ? 'Ahnara Kids' : 'Ahnara Family',
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
  bool _isKidsLogin = false;
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
                const Text(
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
                  _isSignUp ? (_isKidsLogin ? 'Pediatric Care registration' : 'Maternal Care registration') : (_isKidsLogin ? 'Pediatric Care login' : 'Maternal Care login'),
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
                          onTap: () => setState(() => _isKidsLogin = false),
                          child: Container(
                            decoration: BoxDecoration(
                              color: !_isKidsLogin ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Maternal Workspace',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: !_isKidsLogin ? Colors.white : const Color(0xFF001C28),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _isKidsLogin = true),
                          child: Container(
                            decoration: BoxDecoration(
                              color: _isKidsLogin ? const Color(0xFF001C28) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            alignment: Alignment.center,
                            child: Text(
                              'Pediatric Workspace',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: _isKidsLogin ? Colors.white : const Color(0xFF001C28),
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
                            Navigator.pushReplacement(
                              context,
                              PageRouteBuilder(
                                pageBuilder: (context, animation, secondaryAnimation) => DashboardPage(initialIsKidsMode: _isKidsLogin),
                                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                                  return FadeTransition(opacity: animation, child: child);
                                },
                                transitionDuration: const Duration(milliseconds: 500),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF001C28),
                            foregroundColor: Colors.white,
                            shape: const StadiumBorder(),
                          ),
                          child: Text(
                            _isSignUp ? (_isKidsLogin ? 'Create Kids Account' : 'Create Mama Account') : 'Sign In to Dashboard',
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
// 2. DASHBOARD / CONTAINER WIDGET
// ==========================================
class DashboardPage extends StatefulWidget {
  final bool initialIsKidsMode;
  const DashboardPage({super.key, this.initialIsKidsMode = false});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  late bool _isKidsMode;

  @override
  void initState() {
    super.initState();
    _isKidsMode = widget.initialIsKidsMode;
  }
  int _currentIndex = 0;
  int _selectedGestationWeek = 12;

  // Real Web-App Vitals State Variables
  String _weight = "68.4";
  String _bpSystolic = "120";
  String _bpDiastolic = "80";
  String _kicks = "12";
  bool _vitalsLoggedToday = false;

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
    if (_isKidsMode) {
      switch (_currentIndex) {
        case 0:
          bodyContent = const KidsDashboardContent();
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
          bodyContent = const KidsDashboardContent();
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
                    if (_isKidsMode) ...[
                      _buildNavItem(0, TablerIcons.layout_dashboard, 'Today'),
                      _buildNavItem(1, TablerIcons.message_chatbot, 'Pediat.'),
                      _buildNavItem(2, TablerIcons.calendar, 'Vaccines'),
                      _buildNavItem(3, TablerIcons.file_description, 'Growth'),
                      _buildNavItem(4, TablerIcons.pill, 'Milest.'),
                      _buildNavItem(5, TablerIcons.book, 'Academy'),
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
                  color: const Color(0xFFD4F475).withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFD4F475), width: 1),
                ),
                child: Image.asset('assets/logo.png', width: 22, height: 22),
              ),
              const SizedBox(width: 8),
              const Text(
                _isKidsLogin ? 'Ahnara Kids' : 'Ahnara Family',
                style: TextStyle(
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
                            const SnackBar(
                              backgroundColor: Color(0xFFDC2626),
                              content: Text('SOS Dispatch Sent to Nathaniel Reed (Partner) & Emergency Services!'),
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
                  _isKidsMode ? 'Aria Reed (Child)' : 'Tyra Reed',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                ),
                Text(
                  _isKidsMode ? 'Age: 3 months, 12 days • Pediatric Care' : 'tyra@ahnara.com • Gestation Week 12',
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
                        _isKidsMode = !_isKidsMode;
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
  const KidsDashboardContent({super.key});

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
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Aria Reed',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF001C28)),
                    ),
                    Text(
                      'Born: April 10, 2026 • 3 Months Old • Female',
                      style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
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
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(title, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
                child: Icon(icon, color: iconColor, size: 14),
              ),
            ],
          ),
          Text(val, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black, color: Color(0xFF001C28))),
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
                  maxWidth: MediaQuery.of(context).size.width * 0.75,
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
                      fontWeight: FontWeight.semibold,
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
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.extrabold, color: Color(0xFF001C28)),
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
                    Text('6.2 kg (50th Percentile)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Color(0xFF001C28))),
                  ],
                ),
                Divider(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Current Height', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('61 cm (65th Percentile)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Color(0xFF001C28))),
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
                  Text(art['title']!, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.black, color: Color(0xFF001C28))),
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
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: Color(0xFF001C28)),
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
