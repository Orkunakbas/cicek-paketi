import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('NextAuth: Giriş denemesi', credentials?.email);
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            console.error('NextAuth: Giriş başarısız', response.status);
            return null;
          }

          const userData = await response.json();
          
          console.log('NextAuth: Backend response:', userData);
          
          // Backend nested response yapısı: { success, message, data: { user, token } }
          const user = userData?.data?.user || userData?.user || userData;
          const token = userData?.data?.token || userData?.token || userData?.accessToken;
          
          if (!token) {
            console.error('NextAuth: Token bulunamadı', userData);
            return null;
          }

          console.log('NextAuth: Giriş başarılı, token alındı');
          
          return {
            id: user.id || user.user_id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: token,
            companies: user.companies || []
          };
        } catch (err) {
          console.error('NextAuth authorize error:', err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      // Sadece ilk giriş yapıldığında user objesi dolu gelir
      if (user) {
        console.log('NextAuth: Token JWT\'ye kaydediliyor', user);
        token.accessToken = user.token;
        token.userId = user.id;
        token.name = user.name;
        token.surname = user.surname;
        token.email = user.email;
        token.phone = user.phone;
        token.role = user.role;
        token.companies = user.companies;
      }
      return token;
    },
    async session({ session, token }) {
      // Session'a token bilgilerini ekle
      session.accessToken = token.accessToken;
      
      // User bilgilerini ekle
      session.user = {
        id: token.userId,
        name: token.name,
        surname: token.surname,
        email: token.email,
        phone: token.phone,
        role: token.role,
        companies: token.companies
      };
      
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log('NextAuth: Kullanıcı giriş yaptı', user.email);
    },
    async signOut() {
      console.log('NextAuth: Kullanıcı çıkış yaptı');
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}) 