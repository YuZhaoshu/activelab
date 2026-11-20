// Replace null and empty arrays with approved project content. See README.md.
export const project = {
  authors: [],
  affiliations: [],
  links: [
    { label: "arXiv", purpose: "Paper", url: null },
    { label: "GitHub", purpose: "Research code", url: null },
    { label: "Hugging Face", purpose: "Models and data", url: null },
  ],
  hero: null,
  overview: null,
  taskDemos: {
    "pass-the-beaker-from-one-gripper-to-the-other": {
      views: [{
        label: "Active camera",
        image: "./assets/media/beaker-handoff.jpg",
        alt: "Two robotic grippers are positioned around a glass beaker.",
      }],
    },
    "pour-the-water-from-the-graduated-cylinder-into-the-beaker": {
      views: [{
        label: "Active camera",
        image: "./assets/media/cylinder-pour.jpg",
        alt: "A gripper and glassware seen from above during a liquid-transfer demonstration.",
      }],
    },
    "stir-the-contents-of-the-beaker-with-a-glass-rod": {
      views: [{
        label: "Active camera",
        image: "./assets/media/glass-rod-stir.jpg",
        alt: "A glass rod is held next to a beaker containing liquid.",
      }],
    },
    "transfer-liquid-and-return-the-test-tube-to-its-rack": {
      steps: ["Retrieve the test tube", "Pour into the beaker", "Return the tube to the rack"],
    },
    "pour-from-a-graduated-cylinder-and-stir-with-a-glass-rod": {
      steps: ["Pour from the cylinder", "Put down the cylinder", "Pick up the glass rod and stir"],
    },
  },
  comparisons: [],
  skills: [],
  rollouts: [],
  protocol: null,
  results: null,
  bibtex: "",
};
