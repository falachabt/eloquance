


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tjwtnqayxmqotytnfixq.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "**",
      },
    ],
  },
  env: {
    NOTCH_PAY_KEY:
      "pk.qoIGxn6D2TV5WNAXk0kfeIe8aT8Jo99I7em5QD9axKbjshtLBJ2nsXJ6Y79mYJtCxjC6fJ3qi4AHQzNwkAGHrToq7LHoctOf9na5v0cKAJA8WUyUK4YvcHmqBoyZg",

    SUPABASE_URL: "https://ohrqxhyifjghkftckciy.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocnF4aHlpZmpnaGtmdGNrY2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNjY0NTIsImV4cCI6MjA0MTg0MjQ1Mn0.n3ISZba6sJK9DcI2tJT4wIMzRCP1_kOm4TdWcP1rmis",
    SUPABSE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocnF4aHlpZmpnaGtmdGNrY2l5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI2NjQ1MiwiZXhwIjoyMDQxODQyNDUyfQ.cS8RBZ3bnxKezvZ4ehoz7WUyYiK1gvdjX7s1Rl-2WFc",
  
  
    },
};

export default nextConfig;
