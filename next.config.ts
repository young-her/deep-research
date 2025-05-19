import type { NextConfig } from "next";
import pkg from "./package.json";

const BUILD_MODE = process.env.NEXT_PUBLIC_BUILD_MODE;
// AI provider API base url
const API_PROXY_BASE_URL = process.env.API_PROXY_BASE_URL || "";
const GOOGLE_GENERATIVE_AI_API_BASE_URL =
  process.env.GOOGLE_GENERATIVE_AI_API_BASE_URL ||
  "https://generativelanguage.googleapis.com";
const OPENROUTER_API_BASE_URL =
  process.env.OPENROUTER_API_BASE_URL || "https://openrouter.ai/api";
const OPENAI_API_BASE_URL =
  process.env.OPENAI_API_BASE_URL || "https://api.openai.com";
const ANTHROPIC_API_BASE_URL =
  process.env.ANTHROPIC_API_BASE_URL || "https://api.anthropic.com";
const DEEPSEEK_API_BASE_URL =
  process.env.DEEPSEEK_API_BASE_URL || "https://api.deepseek.com";
const XAI_API_BASE_URL = process.env.XAI_API_BASE_URL || "https://api.x.ai";
const MISTRAL_API_BASE_URL =
  process.env.MISTRAL_API_BASE_URL || "https://api.mistral.ai";
const AZURE_RESOURCE_NAME = process.env.AZURE_RESOURCE_NAME || "";
const OPENAI_COMPATIBLE_API_BASE_URL =
  process.env.OPENAI_COMPATIBLE_API_BASE_URL || "";
const POLLINATIONS_API_BASE_URL =
  process.env.POLLINATIONS_API_BASE_URL ||
  "https://text.pollinations.ai/openai";
const OLLAMA_API_BASE_URL =
  process.env.OLLAMA_API_BASE_URL || "http://0.0.0.0:11434";
// Search provider API base url
const TAVILY_API_BASE_URL =
  process.env.TAVILY_API_BASE_URL || "https://api.tavily.com";
const FIRECRAWL_API_BASE_URL =
  process.env.FIRECRAWL_API_BASE_URL || "https://api.firecrawl.dev";
const EXA_API_BASE_URL = process.env.EXA_API_BASE_URL || "https://api.exa.ai";
const BOCHA_API_BASE_URL =
  process.env.BOCHA_API_BASE_URL || "https://api.bochaai.com";
const SEARXNG_API_BASE_URL =
  process.env.SEARXNG_API_BASE_URL || "http://0.0.0.0:8080";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  env: {
    NEXT_PUBLIC_VERSION: pkg.version,
  },
  transpilePackages: ["pdfjs-dist", "mermaid"],
};

if (BUILD_MODE === "export") {
  nextConfig.output = "export";
  // Only used for static deployment, the default deployment directory is the root directory
  nextConfig.basePath = "";
  // Statically exporting a Next.js application via `next export` disables API routes and middleware.
  nextConfig.webpack = (config) => {
    config.module.rules.push({
      test: /src\/app\/api/,
      loader: "ignore-loader",
    });
    config.module.rules.push({
      test: /src\/middleware/,
      loader: "ignore-loader",
    });
    return config;
  };
} else if (BUILD_MODE === "standalone") {
  nextConfig.output = "standalone";
} else {
  nextConfig.rewrites = async () => {
    return [
      {
        source: "/api/ai/google/:path*",
        destination: `${
          GOOGLE_GENERATIVE_AI_API_BASE_URL || API_PROXY_BASE_URL
        }/:path*`,
      },
      {
        source: "/api/ai/openrouter/:path*",
        destination: `${OPENROUTER_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/openai/:path*",
        destination: `${OPENAI_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/anthropic/:path*",
        destination: `${ANTHROPIC_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/deepseek/:path*",
        destination: `${DEEPSEEK_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/xai/:path*",
        destination: `${XAI_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/mistral/:path*",
        destination: `${MISTRAL_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/azure/:path*",
        destination: `https://${AZURE_RESOURCE_NAME}.openai.azure.com/openai/deployments/:path*`,
      },
      {
        source: "/api/ai/openaicompatible/:path*",
        destination: `${OPENAI_COMPATIBLE_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/pollinations/:path*",
        destination: `${POLLINATIONS_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/ai/ollama/:path*",
        destination: `${OLLAMA_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/search/tavily/:path*",
        destination: `${TAVILY_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/search/firecrawl/:path*",
        destination: `${FIRECRAWL_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/search/exa/:path*",
        destination: `${EXA_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/search/bocha/:path*",
        destination: `${BOCHA_API_BASE_URL}/:path*`,
      },
      {
        source: "/api/search/searxng/:path*",
        destination: `${SEARXNG_API_BASE_URL}/:path*`,
      },
    ];
  };
}

export default nextConfig;
