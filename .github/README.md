# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Lucci project.

## Workflows

### 1. `build.yml` - Simple Build Workflow
- **Triggers**: Push and PR to `main` and `develop` branches
- **Purpose**: Basic build verification
- **Jobs**:
  - Lint code
  - Type check
  - Build packages
  - Upload build artifacts

### 2. `ci.yml` - Comprehensive CI/CD Pipeline
- **Triggers**: Push and PR to `main` and `develop` branches
- **Purpose**: Full CI/CD pipeline with separate jobs
- **Jobs**:
  - `lint-and-typecheck`: Code quality checks
  - `build`: Build application and upload artifacts
  - `deploy`: (Commented out) Production deployment

### 3. `pr-checks.yml` - Pull Request Checks
- **Triggers**: Pull requests to `main` and `develop` branches
- **Purpose**: Optimized checks for PRs with change detection
- **Features**:
  - Detects which packages changed
  - Only runs relevant checks
  - Separate jobs for lint, typecheck, and build
  - Shorter artifact retention for PR builds

### 4. `deploy.yml` - Production Deployment
- **Triggers**: Push to `main` branch or manual dispatch
- **Purpose**: Production deployment
- **Features**:
  - Environment protection
  - Multiple deployment platform examples (Vercel, Netlify, AWS S3)

## Configuration

### Required Secrets
For deployment, you'll need to configure these secrets in your repository:

#### Vercel Deployment
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### Netlify Deployment
- `NETLIFY_AUTH_TOKEN`: Your Netlify API token
- `NETLIFY_SITE_ID`: Your Netlify site ID

#### AWS S3 Deployment
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `S3_BUCKET`: S3 bucket name

### Environment Variables
- `NODE_VERSION`: Set to '20' (matches package.json engines requirement)
- `PNPM_VERSION`: Set to '10.4.1' (matches packageManager in package.json)

## Features

### Caching
All workflows use pnpm store caching to speed up dependency installation:
- Cache key based on `pnpm-lock.yaml` hash
- Automatic cache restoration on subsequent runs

### Change Detection
The PR checks workflow uses `dorny/paths-filter` to:
- Detect changes in specific packages
- Only run relevant checks
- Optimize CI time and resources

### Artifact Management
- Build artifacts are uploaded for debugging and deployment
- Different retention periods for PR vs main branch builds
- Separate artifacts for web and convex builds

## Customization

### Adding Tests
To add testing, uncomment the test job in `pr-checks.yml` and add test scripts to your `package.json` files.

### Adding More Deployment Platforms
The `deploy.yml` workflow includes commented examples for:
- Vercel
- Netlify
- AWS S3 + CloudFront

### Modifying Build Commands
Update the build steps in the workflows to match your specific build requirements.

## Troubleshooting

### Common Issues
1. **Build failures**: Check that all dependencies are properly declared in package.json
2. **Cache issues**: Clear the pnpm cache by updating the cache key
3. **Permission issues**: Ensure GitHub Actions has the necessary permissions

### Debugging
- Check the Actions tab in your GitHub repository
- Review build logs for specific error messages
- Use the uploaded artifacts to inspect build outputs
