# Flappy Bird Game

## Project Overview

Flappy Bird Game is a web-based game inspired by the classic Flappy Bird, designed as a student project to teach K-12 students about Genetic Algorithm. Players enter their first name, last name, and grade (0-12) via a form, which is securely stored in Firebase Firestore. After submission, players can play the Flappy Bird game. The project is hosted on GitHub Pages with automated deployment via GitHub Actions.

Live Demo: [https://dcbhupendra7.github.io/Flappy-Bird-Game/](https://dcbhupendra7.github.io/Flappy-Bird-Game/)

## Security Notes

- **Firebase Configuration**: The Firebase configuration (including the API key) is securely stored in GitHub Secrets and injected into `firebase-config.js` during deployment using a GitHub Actions workflow. This prevents sensitive keys from being exposed in the public repository.
- **Firestore Security Rules**: Currently, Firestore allows unauthenticated writes for development purposes:

You can find the documentation detials here in this GitHub Page.
https://dcbhupendra7.github.io/Flappy-Bird-Doc/

##Acknowledgements

- \*\*Inspired by the classic Flappy Bird game. https://flappybird.io/
- \*\*Built as part of a student project to explore HTML, CSS, JavaScript, and Firebase Firestore integration.
- \*\*Special thanks to Firebase documentation and GitHub Actions for enabling secure deployment.
