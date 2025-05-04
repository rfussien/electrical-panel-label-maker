# Electrical Panel Label Maker (EPLM)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Try_it_now!-blue)](https://rfussien.github.io/electrical-panel-label-maker/)

## Overview

Electrical Panel Label Maker (EPLM) is a web application designed to help electricians and homeowners create professional-looking labels for electrical panels. With an intuitive drag-and-drop interface, multilingual support, and a wide range of electrical component icons, EPLM makes it easy to create, customize, and share electrical panel configurations.

## Features

- **Intuitive Interface**: Simple drag-and-drop functionality for arranging modules in your electrical panel
- **Multilingual Support**: Available in English, French, German, and Spanish
- **Comprehensive Icon Library**: Over 50 electrical component icons to choose from
- **Customizable Labels**: Add descriptions and locations for each module
- **Sharing Capabilities**: Generate shareable URLs to collaborate with others
- **Print-Ready Output**: Print your labels directly from the application
- **Dark/Light Mode**: Choose the theme that works best for you
- **Import/Export**: Save and load your panel configurations

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rfussien/electrical-panel-label-maker.git
cd electrical-panel-label-maker

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Add Rows**: Click the "Add Row" button to add a new row to your panel
2. **Edit Modules**: Click on any module to edit its properties (icon, description, location, size)
3. **Rearrange Modules**: Drag and drop modules to rearrange them within the panel
4. **Delete Rows**: Use the delete button at the end of each row to remove it
5. **Change Language**: Use the language selector in the app bar to switch between supported languages
6. **Share Configuration**: Click the share button to generate a URL that you can share with others
7. **Print Labels**: Use the print button to print your completed panel labels

## Building for Production

```bash
# Build the application
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

## Technologies Used

- [Vue.js 3](https://vuejs.org/) - Frontend framework
- [Vuetify 3](https://vuetifyjs.com/) - Material Design component library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Material Design Icons](https://materialdesignicons.com/)
- Inspired by the need for better electrical panel organization