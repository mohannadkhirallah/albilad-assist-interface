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
  Smile
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
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  category: string;
}

export default function BankingChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sample user data - Replace with actual API calls
  const userData = {
    name: 'أحمد محمد / Ahmed Mohammed',
    accountNumber: '****7892',
    balance: '₹ 45,230.50',
    lastLogin: '2024-01-15 14:30',
    avatar: ''
  };

  // Sample FAQs - Replace with actual data
  const faqs: FAQ[] = [
    { id: '1', question: 'Check Account Balance / رصيد الحساب', category: 'balance' },
    { id: '2', question: 'Transfer Money / تحويل الأموال', category: 'transfer' },
    { id: '3', question: 'Recent Transactions / المعاملات الأخيرة', category: 'transactions' },
    { id: '4', question: 'Open New Account / فتح حساب جديد', category: 'account' },
    { id: '5', question: 'Credit Card Info / معلومات البطاقة الائتمانية', category: 'cards' },
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle online/offline status
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
      handleFAQClick({ id: '1', question: 'Check my account balance', category: 'balance' });
    } else if (action === 'transactions') {
      handleFAQClick({ id: '3', question: 'Show recent transactions', category: 'transactions' });
    } else if (action === 'transfer') {
      // Show auth modal for sensitive operation
      setShowAuthModal(true);
    }
  };

  const handleFAQClick = (faq: FAQ) => {
    setInputText(faq.question);
    handleSendMessage();
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
    <div className={`min-h-screen bg-gradient-to-br from-albilad-secondary to-background ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="bg-banking-error text-white text-center py-2 px-4 text-sm font-medium">
          {language === 'ar' ? 'أنت غير متصل - الدردشة في وضع القراءة فقط' : 'You\'re offline - chat is in read-only mode'}
        </div>
      )}

      {/* Header */}
      <header className="bg-banking-card border-b border-banking-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <img 
                src={albiladLogo} 
                alt="Bank Al Bilad" 
                className="h-8 w-auto"
              />
              <span className="text-albilad-primary font-semibold text-lg">
                {language === 'ar' ? 'المساعد الذكي' : 'Smart Assistant'}
              </span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={switchLanguage}
                className="text-albilad-dark hover:bg-albilad-secondary"
              >
                <Globe className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === 'ar' ? 'EN' : 'عر'}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="bg-albilad-primary text-albilad-primary-foreground">
                        {userData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-banking-card border-banking-border" align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'الإعدادات' : 'Settings'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Account Summary Card */}
          <Card className="bg-gradient-card border-banking-border shadow-banking">
            <CardHeader className="pb-3">
              <CardTitle className="text-albilad-primary flex items-center">
                <Shield className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === 'ar' ? 'ملخص الحساب' : 'Account Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-albilad-dark opacity-70">
                    {language === 'ar' ? 'رقم الحساب' : 'Account Number'}
                  </p>
                  <p className="font-mono text-lg font-semibold">{userData.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-albilad-dark opacity-70">
                    {language === 'ar' ? 'الرصيد المتاح' : 'Available Balance'}
                  </p>
                  <p className="text-2xl font-bold text-albilad-primary">{userData.balance}</p>
                </div>
                <div>
                  <p className="text-sm text-albilad-dark opacity-70">
                    {language === 'ar' ? 'آخر دخول' : 'Last Login'}
                  </p>
                  <p className="text-sm">{userData.lastLogin}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-banking-card border-banking-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-albilad-dark">
                {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-albilad-primary text-albilad-primary hover:bg-albilad-primary hover:text-albilad-primary-foreground"
                  onClick={() => handleQuickAction('balance')}
                >
                  <Eye className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === 'ar' ? 'عرض الرصيد' : 'View Balance'}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-albilad-primary text-albilad-primary hover:bg-albilad-primary hover:text-albilad-primary-foreground"
                  onClick={() => handleQuickAction('transactions')}
                >
                  <History className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions'}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-albilad-primary text-albilad-primary hover:bg-albilad-primary hover:text-albilad-primary-foreground"
                  onClick={() => handleQuickAction('transfer')}
                >
                  <CreditCard className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === 'ar' ? 'تحويل الأموال' : 'Transfer Funds'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Carousel */}
          <Card className="bg-banking-card border-banking-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-albilad-dark">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-3 overflow-x-auto pb-2 rtl:space-x-reverse">
                {faqs.map((faq) => (
                  <Button
                    key={faq.id}
                    variant="ghost"
                    className="min-w-max bg-albilad-secondary hover:bg-albilad-primary hover:text-albilad-primary-foreground px-4 py-2 rounded-lg text-sm"
                    onClick={() => handleFAQClick(faq)}
                  >
                    {faq.question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Container */}
          <Card className="bg-banking-card border-banking-border shadow-floating">
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-albilad-primary text-albilad-primary-foreground ml-4'
                          : 'bg-banking-muted text-albilad-dark mr-4 shadow-card'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.type === 'bot' && (
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-albilad-success hover:text-white"
                              onClick={() => handleRating(message.id, 'up')}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-banking-error hover:text-white"
                              onClick={() => handleRating(message.id, 'down')}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-banking-muted text-albilad-dark px-4 py-3 rounded-xl mr-4 shadow-card">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🤖</span>
                        <span className="text-sm">
                          {language === 'ar' ? 'يكتب...' : 'Thinking...'}
                        </span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-albilad-primary rounded-full animate-typing"></div>
                          <div className="w-2 h-2 bg-albilad-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-albilad-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <Separator className="bg-banking-border" />

              {/* Input Area */}
              <div className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex-1 relative">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={
                        language === 'ar'
                          ? 'اكتب رسالتك هنا...'
                          : 'Type your message here...'
                      }
                      className="bg-banking-muted border-banking-border focus:border-albilad-primary pr-32 rtl:pr-4 rtl:pl-32"
                      disabled={isOffline}
                    />
                    
                    {/* Input Controls */}
                    <div className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 flex space-x-1 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-albilad-secondary"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-albilad-secondary"
                        onClick={handleFileUpload}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          isRecording 
                            ? 'bg-banking-error text-white hover:bg-banking-error' 
                            : 'hover:bg-albilad-success hover:text-white'
                        }`}
                        onClick={toggleRecording}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isOffline}
                    className="bg-albilad-primary hover:bg-albilad-accent text-albilad-primary-foreground h-10 px-6"
                  >
                    <Send className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'إرسال' : 'Send'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-banking-card border-t border-banking-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <Button variant="ghost" className="text-albilad-dark hover:text-albilad-primary">
                <HelpCircle className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === 'ar' ? 'المساعدة' : 'Help'}
              </Button>
              <Button variant="ghost" className="text-albilad-dark hover:text-albilad-primary">
                <FileText className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === 'ar' ? 'الخصوصية' : 'Privacy'}
              </Button>
            </div>
            
            <Button
              className="bg-albilad-success hover:bg-albilad-success/90 text-white"
              onClick={() => toast({
                title: language === 'ar' ? 'جاري التوصيل...' : 'Connecting...',
                description: language === 'ar' ? 'سيتم توصيلك بممثل خدمة العملاء' : 'You will be connected to a live agent',
              })}
            >
              <Phone className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === 'ar' ? 'التحدث مع مندوب' : 'Talk to Live Agent'}
            </Button>
          </div>
        </div>
      </footer>

      {/* Re-Authentication Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-banking-card border-banking-border">
          <DialogHeader>
            <DialogTitle className="text-albilad-primary">
              {language === 'ar' ? 'تأكيد الهوية' : 'Identity Verification'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'لأمانك، يرجى تأكيد هويتك لإتمام هذه العملية'
                : 'For your security, please verify your identity to complete this transaction'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              className="w-full bg-albilad-primary hover:bg-albilad-accent text-albilad-primary-foreground"
              onClick={() => {
                setShowAuthModal(false);
                toast({
                  title: language === 'ar' ? 'تم التحقق بنجاح' : 'Verification Successful',
                  description: language === 'ar' ? 'يمكنك الآن المتابعة' : 'You can now proceed',
                });
              }}
            >
              <Shield className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === 'ar' ? 'تحقق بالبصمة' : 'Verify with Biometrics'}
            </Button>
            <Button
              variant="outline"
              className="w-full border-banking-border"
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