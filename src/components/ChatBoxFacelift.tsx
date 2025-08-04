import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Globe, 
  User, 
  Settings, 
  LogOut,
  Eye,
  History,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  Shield,
  HelpCircle,
  Phone,
  ChevronRight,
  ChevronLeft,
  FileText,
  Smile,
  ChevronDown,
  CheckCircle,
  Zap,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import albiladLogo from '@/assets/albilad-logo.png';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  category: string;
  icon: React.ReactNode;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
}

export default function ChatBoxFacelift() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      type: 'system',
      content: 'Connected to Al Bilad Secure Banking • End-to-end encrypted',
      timestamp: new Date(),
    },
    {
      id: '1',
      type: 'bot',
      content: 'أهلاً وسهلاً بك في مساعد البنك الذكي! كيف يمكنني مساعدتك اليوم؟\n\nWelcome to Al Bilad Smart Assistant! How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showNewMessageToast, setShowNewMessageToast] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample user data - Replace with actual API calls
  const userData = {
    name: 'أحمد محمد / Ahmed Mohammed',
    accountNumber: '****7892',
    balance: '₹ 45,230.50',
    lastLogin: '2024-01-15 14:30',
    avatar: ''
  };

  // Enhanced Quick Actions with icons
  const quickActions: QuickAction[] = [
    { id: 'balance', label: language === 'ar' ? 'الرصيد' : 'Balance', icon: <Eye className="h-4 w-4" />, action: 'balance' },
    { id: 'transfer', label: language === 'ar' ? 'تحويل' : 'Transfer', icon: <CreditCard className="h-4 w-4" />, action: 'transfer' },
    { id: 'history', label: language === 'ar' ? 'المعاملات' : 'History', icon: <History className="h-4 w-4" />, action: 'transactions' },
    { id: 'support', label: language === 'ar' ? 'دعم' : 'Support', icon: <HelpCircle className="h-4 w-4" />, action: 'support' },
  ];

  // Enhanced FAQs with icons
  const faqs: FAQ[] = [
    { 
      id: '1', 
      question: language === 'ar' ? 'رصيد الحساب' : 'Account Balance', 
      category: 'balance',
      icon: <Eye className="h-4 w-4" />
    },
    { 
      id: '2', 
      question: language === 'ar' ? 'تحويل الأموال' : 'Transfer Money', 
      category: 'transfer',
      icon: <CreditCard className="h-4 w-4" />
    },
    { 
      id: '3', 
      question: language === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions', 
      category: 'transactions',
      icon: <History className="h-4 w-4" />
    },
    { 
      id: '4', 
      question: language === 'ar' ? 'فتح حساب جديد' : 'Open New Account', 
      category: 'account',
      icon: <Shield className="h-4 w-4" />
    },
    { 
      id: '5', 
      question: language === 'ar' ? 'بطاقة ائتمانية' : 'Credit Card Info', 
      category: 'cards',
      icon: <CreditCard className="h-4 w-4" />
    },
  ];

  // Scroll behavior for header shrinking
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrolled = scrollContainerRef.current.scrollTop > 50;
        setIsHeaderShrunk(scrolled);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isOffline) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response with delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputText),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Show new message toast
      setShowNewMessageToast(true);
      setTimeout(() => setShowNewMessageToast(false), 3000);
    }, 1500);
  };

  const generateBotResponse = (input: string): string => {
    // Simple response logic - Replace with actual AI/API integration
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('balance') || lowerInput.includes('رصيد')) {
      return `Your current account balance is ${userData.balance}. Is there anything specific you'd like to know about your account?\n\nرصيدك الحالي هو ${userData.balance}. هل تود معرفة أي معلومات إضافية؟`;
    }
    if (lowerInput.includes('transfer') || lowerInput.includes('تحويل')) {
      return 'I can help you with money transfers. Would you like to transfer within Al Bilad accounts or to other banks?\n\nيمكنني مساعدتك في تحويل الأموال. هل تود التحويل داخل بنك البلاد أم لبنوك أخرى؟';
    }
    return 'Thank you for your message. I understand your inquiry and will provide you with the best assistance. How else can I help?\n\nشكراً لك على رسالتك. سأقوم بمساعدتك بأفضل طريقة ممكنة. كيف يمكنني مساعدتك أكثر؟';
  };

  const handleQuickAction = (action: string) => {
    if (action === 'balance') {
      setInputText(language === 'ar' ? 'أريد معرفة رصيد حسابي' : 'Check my account balance');
      handleSendMessage();
    } else if (action === 'transactions') {
      setInputText(language === 'ar' ? 'أظهر المعاملات الأخيرة' : 'Show recent transactions');
      handleSendMessage();
    } else if (action === 'transfer') {
      setShowAuthModal(true);
    } else if (action === 'support') {
      setInputText(language === 'ar' ? 'أحتاج مساعدة' : 'I need help');
      handleSendMessage();
    }
  };

  const handleFAQClick = (faq: FAQ) => {
    setInputText(faq.question);
    setTimeout(handleSendMessage, 100);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: language === 'ar' ? 'بدء التسجيل' : 'Recording started',
        description: language === 'ar' ? 'اضغط مرة أخرى لإيقاف التسجيل' : 'Tap again to stop recording',
      });
    }
  };

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    toast({
      title: language === 'ar' ? 'شكراً لتقييمك' : 'Thank you for your feedback',
      description: language === 'ar' ? 'سنعمل على تحسين خدماتنا' : 'We\'ll use this to improve our service',
    });
  };

  const switchLanguage = () => {
    setLanguage(lang => lang === 'ar' ? 'en' : 'ar');
    toast({
      title: language === 'ar' ? 'Language switched to English' : 'تم تغيير اللغة إلى العربية',
    });
  };

  return (
    <div className={`min-h-screen bg-albilad-bg font-inter ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="bg-red-500 text-white text-center py-2 px-4 text-sm font-medium tracking-wide animate-float-up">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{language === 'ar' ? 'أنت غير متصل - الدردشة في وضع القراءة فقط' : 'You\'re offline - chat is in read-only mode'}</span>
          </div>
        </div>
      )}

      {/* Enhanced Header with Shrink Effect */}
      <header className={`bg-albilad-surface border-b border-albilad-border shadow-elevated backdrop-blur-sm sticky top-0 z-40 transition-all duration-300 ease-in-out ${
        isHeaderShrunk ? 'py-2' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isHeaderShrunk ? 'h-12' : 'h-16'
          }`}>
            {/* Logo with smooth scaling */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <img 
                src={albiladLogo} 
                alt="Bank Al Bilad" 
                className={`w-auto transition-all duration-300 ${isHeaderShrunk ? 'h-6' : 'h-8'}`}
              />
              <div className="flex flex-col">
                <span className={`text-albilad-primary font-semibold tracking-wide transition-all duration-300 ${
                  isHeaderShrunk ? 'text-base' : 'text-lg'
                }`}>
                  {language === 'ar' ? 'المساعد الذكي' : 'Smart Assistant'}
                </span>
                {!isHeaderShrunk && (
                  <span className="text-xs text-albilad-muted opacity-75 animate-fade-in">
                    {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered Banking'}
                  </span>
                )}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Language Toggle with enhanced styling */}
              <Button
                variant="ghost"
                size="sm"
                onClick={switchLanguage}
                className="text-albilad-dark hover:bg-albilad-hover-bg ring-offset-albilad-bg focus:ring-2 focus:ring-albilad-focus focus:ring-offset-2 transition-all duration-200 hover:scale-105"
              >
                <Globe className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span className="font-medium">{language === 'ar' ? 'EN' : 'عر'}</span>
              </Button>

              {/* Enhanced User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-albilad-bg focus:ring-2 focus:ring-albilad-focus focus:ring-offset-2">
                    <Avatar className="h-9 w-9 shadow-neumorph-light hover:shadow-elevated transition-all duration-200">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="bg-albilad-primary text-white font-semibold">
                        {userData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-albilad-accent rounded-full border-2 border-albilad-surface"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-albilad-surface border-albilad-border shadow-floating" align="end">
                  <DropdownMenuItem className="hover:bg-albilad-hover-bg focus:bg-albilad-hover-bg transition-colors duration-200">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-medium">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-albilad-hover-bg focus:bg-albilad-hover-bg transition-colors duration-200">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="font-medium">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-albilad-hover-bg focus:bg-albilad-hover-bg transition-colors duration-200">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with improved spacing */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Enhanced Account Summary Card with Neumorphic Design */}
        <Card className="bg-albilad-surface border-albilad-border shadow-neumorph-light hover:shadow-elevated transition-all duration-300 group">
          <CardHeader className="pb-4">
            <CardTitle className="text-albilad-primary flex items-center text-lg font-semibold tracking-wide">
              <Shield className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-albilad-accent" />
              <span>{language === 'ar' ? 'ملخص الحساب' : 'Account Summary'}</span>
              <Badge variant="secondary" className="ml-auto rtl:ml-0 rtl:mr-auto bg-albilad-accent text-white text-xs">
                {language === 'ar' ? 'آمن' : 'Secure'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-albilad-muted font-medium tracking-wider uppercase">
                  {language === 'ar' ? 'رقم الحساب' : 'Account Number'}
                </p>
                <p className="font-mono text-lg font-semibold text-albilad-dark letter-spacing-wider">{userData.accountNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-albilad-muted font-medium tracking-wider uppercase">
                  {language === 'ar' ? 'الرصيد المتاح' : 'Available Balance'}
                </p>
                <p className="text-3xl font-bold text-albilad-primary tracking-tight">{userData.balance}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-albilad-muted font-medium tracking-wider uppercase">
                  {language === 'ar' ? 'آخر دخول' : 'Last Login'}
                </p>
                <p className="text-sm text-albilad-dark font-medium">{userData.lastLogin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions with Neumorphic Pills */}
        <Card className="bg-albilad-surface border-albilad-border shadow-neumorph-light">
          <CardHeader className="pb-4">
            <CardTitle className="text-albilad-dark flex items-center justify-between text-lg font-semibold">
              <span>{language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="h-8 w-8 p-0 hover:bg-albilad-hover-bg"
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showQuickActions ? 'rotate-180' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          {showQuickActions && (
            <CardContent className="animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-16 bg-albilad-card border-albilad-border hover:bg-albilad-primary hover:text-white shadow-neumorph-light hover:shadow-elevated transition-all duration-200 hover:scale-105 group"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {action.icon}
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Enhanced FAQ Carousel */}
        <Card className="bg-albilad-surface border-albilad-border shadow-neumorph-light">
          <CardHeader className="pb-4">
            <CardTitle className="text-albilad-dark text-lg font-semibold">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3 overflow-x-auto pb-2 rtl:space-x-reverse scrollbar-hide">
              {faqs.map((faq) => (
                <Button
                  key={faq.id}
                  variant="ghost"
                  className="min-w-max bg-albilad-card hover:bg-albilad-primary hover:text-white px-4 py-3 rounded-2xl text-sm font-medium shadow-neumorph-light hover:shadow-elevated transition-all duration-200 group flex items-center space-x-2 rtl:space-x-reverse"
                  onClick={() => handleFAQClick(faq)}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {faq.icon}
                  </div>
                  <span>{faq.question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Chat Container with Floating Design */}
        <Card className="bg-albilad-surface border-albilad-border shadow-floating hover:shadow-elevated transition-all duration-300">
          <CardContent className="p-0">
            {/* Messages Area with improved styling */}
            <div 
              ref={scrollContainerRef}
              className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-albilad-muted scrollbar-track-transparent"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex animate-float-up ${
                    message.type === 'user' ? 'justify-end' : 
                    message.type === 'system' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  {message.type === 'system' ? (
                    <div className="bg-albilad-card text-albilad-muted px-4 py-2 rounded-full text-xs font-medium flex items-center space-x-2 shadow-neumorph-inset">
                      <Shield className="h-3 w-3" />
                      <span>{message.content}</span>
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl relative group transition-all duration-200 ${
                        message.type === 'user'
                          ? 'bg-albilad-primary text-white ml-4 shadow-neumorph-light hover:shadow-elevated'
                          : 'bg-albilad-card text-albilad-dark mr-4 shadow-neumorph-light hover:shadow-elevated'
                      }`}
                    >
                      <p className="text-sm leading-relaxed tracking-wide whitespace-pre-line font-medium">{message.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs opacity-70 font-medium">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.type === 'bot' && (
                          <div className="flex space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-albilad-accent hover:text-white transition-all duration-200 hover:scale-110"
                              onClick={() => handleRating(message.id, 'up')}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110"
                              onClick={() => handleRating(message.id, 'down')}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-albilad-card text-albilad-dark px-5 py-4 rounded-2xl mr-4 shadow-neumorph-light">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-albilad-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {language === 'ar' ? 'المساعد يكتب...' : 'Assistant is typing...'}
                        </span>
                        <div className="flex space-x-1 mt-1">
                          <div className="w-2 h-2 bg-albilad-primary rounded-full animate-typing"></div>
                          <div className="w-2 h-2 bg-albilad-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-albilad-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Separator className="bg-albilad-border" />

            {/* Enhanced Input Area with Floating Design */}
            <div className="p-6 bg-albilad-surface backdrop-blur-sm">
              <div className="relative">
                {/* Floating Label Input */}
                <div className="relative">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder=" "
                    className={`h-14 bg-albilad-card border-2 transition-all duration-200 rounded-2xl shadow-neumorph-inset focus:shadow-elevated pr-40 rtl:pr-4 rtl:pl-40 text-base font-medium tracking-wide ${
                      inputFocused || inputText 
                        ? 'border-albilad-primary ring-4 ring-albilad-primary/20' 
                        : 'border-albilad-border focus:border-albilad-primary'
                    }`}
                    disabled={isOffline}
                  />
                  
                  {/* Floating Label */}
                  <label className={`absolute left-4 rtl:left-auto rtl:right-4 transition-all duration-200 pointer-events-none font-medium ${
                    inputFocused || inputText
                      ? '-top-2 text-xs bg-albilad-surface px-2 text-albilad-primary'
                      : 'top-4 text-base text-albilad-muted'
                  }`}>
                    {language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                  </label>
                  
                  {/* Enhanced Input Controls */}
                  <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-albilad-hover-bg transition-all duration-200 hover:scale-110"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-albilad-hover-bg transition-all duration-200 hover:scale-110"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110 ${
                        isRecording 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'hover:bg-albilad-accent hover:text-white'
                      }`}
                      onClick={toggleRecording}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Enhanced Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isOffline}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 bg-albilad-primary hover:bg-albilad-primary-hover text-white h-10 px-6 rounded-2xl shadow-neumorph-light hover:shadow-elevated transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 group"
                >
                  <Send className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 transition-transform duration-200 group-hover:scale-110 group-active:animate-elastic-bounce" />
                  <span className="font-semibold">{language === 'ar' ? 'إرسال' : 'Send'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-albilad-surface border-t border-albilad-border mt-12 shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
            <div className="flex items-center space-x-8 rtl:space-x-reverse">
              <Button 
                variant="ghost" 
                className="text-albilad-dark hover:text-albilad-primary hover:bg-albilad-hover-bg transition-all duration-200 group"
              >
                <HelpCircle className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium relative">
                  {language === 'ar' ? 'المساعدة' : 'Help'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-albilad-primary transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Button>
              <Button 
                variant="ghost" 
                className="text-albilad-dark hover:text-albilad-primary hover:bg-albilad-hover-bg transition-all duration-200 group"
              >
                <FileText className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium relative">
                  {language === 'ar' ? 'الخصوصية' : 'Privacy'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-albilad-primary transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Button>
            </div>
            
            <Button
              className="bg-albilad-accent hover:bg-albilad-accent-hover text-white px-8 py-3 rounded-2xl shadow-neumorph-light hover:shadow-elevated transition-all duration-200 hover:scale-105 group"
              onClick={() => toast({
                title: language === 'ar' ? 'جاري التوصيل...' : 'Connecting...',
                description: language === 'ar' ? 'سيتم توصيلك بممثل خدمة العملاء' : 'You will be connected to a live agent',
              })}
            >
              <Phone className="h-4 w-4 mr-3 rtl:mr-0 rtl:ml-3 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-semibold">{language === 'ar' ? 'التحدث مع مندوب' : 'Talk to Live Agent'}</span>
            </Button>
          </div>
        </div>
      </footer>

      {/* New Message Toast */}
      {showNewMessageToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-albilad-accent text-white px-6 py-3 rounded-2xl shadow-floating animate-float-up z-50">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium text-sm">
              {language === 'ar' ? 'رسالة جديدة' : 'New message'}
            </span>
          </div>
        </div>
      )}

      {/* Enhanced Re-Authentication Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-albilad-surface border-albilad-border shadow-floating rounded-3xl">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-albilad-primary text-xl font-semibold text-center">
              {language === 'ar' ? 'تأكيد الهوية' : 'Identity Verification'}
            </DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed">
              {language === 'ar' 
                ? 'لأمانك، يرجى تأكيد هويتك لإتمام هذه العملية الحساسة'
                : 'For your security, please verify your identity to complete this sensitive transaction'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <Button
              className="w-full h-14 bg-albilad-primary hover:bg-albilad-primary-hover text-white rounded-2xl font-semibold shadow-neumorph-light hover:shadow-elevated transition-all duration-200 hover:scale-105 group"
              onClick={() => {
                setShowAuthModal(false);
                toast({
                  title: language === 'ar' ? 'تم التحقق بنجاح' : 'Verification Successful',
                  description: language === 'ar' ? 'يمكنك الآن المتابعة' : 'You can now proceed',
                });
              }}
            >
              <Shield className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 transition-transform duration-200 group-hover:scale-110" />
              <span>{language === 'ar' ? 'تحقق بالبصمة' : 'Verify with Biometrics'}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-albilad-border hover:bg-albilad-hover-bg rounded-2xl font-semibold transition-all duration-200 hover:scale-105"
              onClick={() => setShowAuthModal(false)}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            toast({
              title: language === 'ar' ? 'تم رفع الملف' : 'File Uploaded',
              description: file.name,
            });
          }
        }}
      />
    </div>
  );
}