/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file defines the route tree for TanStack Router.

import { Route as rootRouteImport } from './routes/__root'
import { Route as AuthRouteImport } from './routes/auth'
import { Route as AuthenticatedRouteRouteImport } from './routes/_authenticated/route'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthenticatedAdminRouteImport } from './routes/_authenticated/admin'
import { Route as ServicesRouteImport } from './routes/services'
import { Route as PortfolioRouteImport } from './routes/portfolio'
import { Route as ShowcaseRouteImport } from './routes/showcase'
import { Route as AboutRouteImport } from './routes/about'
import { Route as PricingRouteImport } from './routes/pricing'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as VideoAdminRouteImport } from './routes/video-admin'

const VideoAdminRoute = VideoAdminRouteImport.update({
  id: '/video-admin',
  path: '/video-admin',
  getParentRoute: () => rootRouteImport,
} as any)

const AuthRoute = AuthRouteImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRouteImport,
} as any)

const AuthenticatedRouteRoute = AuthenticatedRouteRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRouteImport,
} as any)

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

const ServicesRoute = ServicesRouteImport.update({
  id: '/services',
  path: '/services',
  getParentRoute: () => rootRouteImport,
} as any)

const PortfolioRoute = PortfolioRouteImport.update({
  id: '/portfolio',
  path: '/portfolio',
  getParentRoute: () => rootRouteImport,
} as any)

const ShowcaseRoute = ShowcaseRouteImport.update({
  id: '/showcase',
  path: '/showcase',
  getParentRoute: () => rootRouteImport,
} as any)

const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)

const PricingRoute = PricingRouteImport.update({
  id: '/pricing',
  path: '/pricing',
  getParentRoute: () => rootRouteImport,
} as any)

const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)

const AuthenticatedAdminRoute = AuthenticatedAdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth': typeof AuthRoute
  '/admin': typeof AuthenticatedAdminRoute
  '/services': typeof ServicesRoute
  '/portfolio': typeof PortfolioRoute
  '/showcase': typeof ShowcaseRoute
  '/about': typeof AboutRoute
  '/pricing': typeof PricingRoute
  '/contact': typeof ContactRoute
  '/video-admin': typeof VideoAdminRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth': typeof AuthRoute
  '/admin': typeof AuthenticatedAdminRoute
  '/services': typeof ServicesRoute
  '/portfolio': typeof PortfolioRoute
  '/showcase': typeof ShowcaseRoute
  '/about': typeof AboutRoute
  '/pricing': typeof PricingRoute
  '/contact': typeof ContactRoute
  '/video-admin': typeof VideoAdminRoute
}

export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/auth': typeof AuthRoute
  '/_authenticated/admin': typeof AuthenticatedAdminRoute
  '/services': typeof ServicesRoute
  '/portfolio': typeof PortfolioRoute
  '/showcase': typeof ShowcaseRoute
  '/about': typeof AboutRoute
  '/pricing': typeof PricingRoute
  '/contact': typeof ContactRoute
  '/video-admin': typeof VideoAdminRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/auth' | '/admin' | '/services' | '/portfolio' | '/showcase' | '/about' | '/pricing' | '/contact' | '/video-admin'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/auth' | '/admin' | '/services' | '/portfolio' | '/showcase' | '/about' | '/pricing' | '/contact' | '/video-admin'
  id: '__root__' | '/' | '/_authenticated' | '/auth' | '/_authenticated/admin' | '/services' | '/portfolio' | '/showcase' | '/about' | '/pricing' | '/contact' | '/video-admin'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  AuthRoute: typeof AuthRoute
  ServicesRoute: typeof ServicesRoute
  PortfolioRoute: typeof PortfolioRoute
  ShowcaseRoute: typeof ShowcaseRoute
  AboutRoute: typeof AboutRoute
  PricingRoute: typeof PricingRoute
  ContactRoute: typeof ContactRoute
  VideoAdminRoute: typeof VideoAdminRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/services': {
      id: '/services'
      path: '/services'
      fullPath: '/services'
      preLoaderRoute: typeof ServicesRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/portfolio': {
      id: '/portfolio'
      path: '/portfolio'
      fullPath: '/portfolio'
      preLoaderRoute: typeof PortfolioRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/showcase': {
      id: '/showcase'
      path: '/showcase'
      fullPath: '/showcase'
      preLoaderRoute: typeof ShowcaseRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/pricing': {
      id: '/pricing'
      path: '/pricing'
      fullPath: '/pricing'
      preLoaderRoute: typeof PricingRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated/admin': {
      id: '/_authenticated/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AuthenticatedAdminRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/video-admin': {
      id: '/video-admin'
      path: '/video-admin'
      fullPath: '/video-admin'
      preLoaderRoute: typeof VideoAdminRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

interface AuthenticatedRouteRouteChildren {
  AuthenticatedAdminRoute: typeof AuthenticatedAdminRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute: AuthRoute,
  ServicesRoute: ServicesRoute,
  PortfolioRoute: PortfolioRoute,
  ShowcaseRoute: ShowcaseRoute,
  AboutRoute: AboutRoute,
  PricingRoute: PricingRoute,
  ContactRoute: ContactRoute,
  VideoAdminRoute: VideoAdminRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
