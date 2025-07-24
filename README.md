# React To-Do App with Appwrite

A simple **React To-Do List application** built with modern React features and powered by [Appwrite](https://appwrite.io) backend for data persistence.

---

## Features
- Add, delete, and toggle completion of tasks  
- Filter tasks by all, complete, or pending  
- Uses Appwrite for backend document storage  
- Easily configurable with environment variables  
- Built with React, TypeScript, and Tailwind CSS

---

## Technologies Used
- React with Hooks and TypeScript  
- Tailwind CSS for styling  
- Appwrite for backend API  
- React Icons for UI icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)  
- npm or yarn (package manager)  
- An [Appwrite](https://appwrite.io) project with a database and collection setup  

### Setup

1. **Clone the repository**

2. **Install dependencies**

3. **Configure your environment variables**

Create a `.env` file in the root directory and add your Appwrite configuration:
> VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint <br>
> VITE_APPWRITE_PROJECT_ID=your_project_id <br>
> VITE_APPWRITE_DATABASE_ID=your_database_id <br>
> VITE_APPWRITE_COLLECTION_ID=your_collection_id

Replace each value with your actual Appwrite endpoint and IDs.

4. **Run the development server**