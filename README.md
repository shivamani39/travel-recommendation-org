# TripFactory - Travel Recommendation System

TripFactory-Travel Recommendation System is a full-stack personalized travel recommendation application that helps users discover their next perfect destination based on budget, duration, and interests.

## 🚀 Features

- **Personalized Recommendations**: Get tailored travel suggestions based on your preferences.
- **Dynamic Filtering**: Filter destinations by budget range, trip duration, and specific interests (e.g., Adventure, Culture, Food).
- **Responsive Design**: Modern, mobile-friendly interface built with Next.js and Tailwind CSS.
- **Rich Visuals**: Immersive destination cards and details pages.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS, Shadcn/ui
- **Language**: TypeScript

### Backend
- **Framework**: Spring Boot (Java)
- **Database**: H2 (In-memory for MVP) / MySQL compatible
- **Build Tool**: Maven

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven (optional, `mvnw` wrapper included)

    git clone https://github.com/shivamani39/travel-recommendation-org
    cd travel-recommendation-org
    ```

2.  **Start the Backend Server**
    The backend runs on port `8080`.
    
    ./mvnw spring-boot:run
    ```

3.  **Start the Frontend Client**
    Open a new terminal and navigate to the frontend directory.
    ```bash
    cd travel-recommendation-system
    npm install
    npm run dev
    ```

4.  **Access the Application**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
travel-recommendation-mvp/
├── src/                        # Spring Boot Backend Source
├── pom.xml                     # Maven Configuration
├── travel-recommendation-system/ # Next.js Frontend
│   ├── app/                    # App Router Pages
│   ├── components/             # React Components (Header, etc.)
│   └── public/                 # Static Assets
└── README.md                   # Project Documentation
```

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
