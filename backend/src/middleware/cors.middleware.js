// Custom CORS middleware to help avoid Cloudflare issues
const customCorsMiddleware = (req, res, next) => {
   // Allow requests from any origin
   res.header('Access-Control-Allow-Origin', '*');

   // Allow specific headers
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY'
   );

   // Allow specific methods
   res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH'
   );

   // Set cache control headers to prevent caching
   res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
   res.header('Pragma', 'no-cache');
   res.header('Expires', '0');

   // Handle preflight requests
   if (req.method === 'OPTIONS') {
      return res.status(200).end();
   }

   next();
};

export default customCorsMiddleware; 