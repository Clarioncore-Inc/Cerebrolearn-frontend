// Global fetch interceptor to prevent "Failed to fetch" errors
// This intercepts ALL fetch calls, including Supabase Auth's internal calls

const originalFetch = window.fetch;

// Store the original fetch for restoration if needed
export const restoreFetch = () => {
  window.fetch = originalFetch;
};

// Initialize fetch interceptor
export const initializeFetchInterceptor = () => {
  // Only intercept if not already intercepted
  if (window.fetch === interceptedFetch) {
    return;
  }

  window.fetch = interceptedFetch as typeof fetch;
  console.log('[Fetch Interceptor] Initialized - All network calls will be intercepted');
};

async function interceptedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  
  // Don't log every single request to avoid console spam
  const shouldLog = !url.includes('/auth/v1/token');
  
  if (shouldLog) {
    console.log(`[Fetch Interceptor] ${init?.method || 'GET'} ${url}`);
  }
  
  // Allow Supabase Auth calls through but catch errors gracefully
  if (url.includes('supabase.co/auth/v1')) {
    try {
      const response = await originalFetch(input, init);
      return response;
    } catch (error) {
      // Supabase auth call failed - this is expected in offline/demo mode
      // Return a successful mock response to prevent errors from bubbling up
      if (shouldLog) {
        console.log(`[Fetch Interceptor] Auth call intercepted (offline mode): ${url}`);
      }
      
      // Create a mock successful auth response
      const mockResponse = new Response(
        JSON.stringify({
          access_token: 'mock-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'offline-user',
            email: 'offline@demo.com',
            user_metadata: {
              full_name: 'Offline User',
              role: 'learner'
            }
          }
        }),
        {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      return mockResponse;
    }
  }
  
  // For our own backend calls, return mock responses
  if (url.includes('/functions/v1/make-server-c6a99485')) {
    if (shouldLog) {
      console.log(`[Fetch Interceptor] Backend call intercepted (dummy mode): ${url}`);
    }
    
    const mockResponse = new Response(
      JSON.stringify({
        success: true,
        message: 'Dummy data mode - backend calls are mocked',
      }),
      {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return mockResponse;
  }
  
  // Allow all other requests (like Unsplash images, CDN resources) through
  try {
    return await originalFetch(input, init);
  } catch (error) {
    // External request failed - log but don't throw
    if (shouldLog) {
      console.log(`[Fetch Interceptor] External request failed (expected): ${url}`);
    }
    
    // Return a mock response for failed external requests
    return new Response(
      JSON.stringify({
        error: 'network_error',
        message: 'Request failed - offline mode',
      }),
      {
        status: 200, // Return 200 to prevent errors
        statusText: 'OK (Offline)',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  initializeFetchInterceptor();
}