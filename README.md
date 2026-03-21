# Innoverse - Your Innovation Hub

Innoverse is a cutting-edge platform designed to bridge the gap between visionary companies and brilliant problem solvers. Whether you're an engineer, designer, or freelancer, Innoverse provides the tools to showcase your skills, collaborate on real-world challenges, and build an AI-verified portfolio.

## 🚀 Key Features

- **Portfolio Builder**: Create a stunning, professional portfolio that highlights your projects, skills, and journey.
- **AI-Verified Portfolios**: Get your solutions evaluated by our advanced AI engine, providing objective feedback and validation.
- **Public Developer Profiles**: Shareable profile URLs to help you get discovered by recruiters and collaborators worldwide.
- **Hackathon Platform**: Participate in high-impact hackathons and showcase your winning projects.
- **Company Dashboard**: Companies can post real-world problems and find top talent through verifiable results.
- **Developer Network**: Connect and collaborate with a global community of innovators.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: Bcryptjs
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance (Local or Atlas)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd innoverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

**Innoverse is designed to be deployed using Vercel only.**

To deploy your own instance:

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Import your project into [Vercel](https://vercel.com/new).
3. Add your `MONGODB_URI` to the Environment Variables in the Vercel project settings.
4. Click **Deploy**.

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📄 License

This project is licensed under the MIT License.
