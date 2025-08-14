class GirlyGirl {
  constructor() {
    this.version = '1.0.0';
    this.features = [];
  }

  initialize() {
    console.log('GirlyGirl project initialized');
    console.log(`Version: ${this.version}`);
    return true;
  }

  addFeature(feature) {
    this.features.push(feature);
    console.log(`Feature added: ${feature}`);
  }

  listFeatures() {
    if (this.features.length === 0) {
      console.log('No features added yet');
      return [];
    }
    console.log('Current features:');
    this.features.forEach((feature, index) => {
      console.log(`  ${index + 1}. ${feature}`);
    });
    return this.features;
  }

  cat() {
    const catActions = [
      'meow',
      'purr',
      'stretch',
      'nap',
      'play',
      'hunt',
      'groom'
    ];
    
    const randomAction = catActions[Math.floor(Math.random() * catActions.length)];
    const message = `🐱 The cat decides to ${randomAction}!`;
    console.log(message);
    return {
      action: randomAction,
      message: message
    };
  }
}

const app = new GirlyGirl();
app.initialize();
app.addFeature('Initial setup');
app.addFeature('Basic structure');
app.addFeature('Cat simulation');
app.listFeatures();

// Demonstrate the cat feature
console.log('\n--- Cat Feature Demo ---');
for (let i = 0; i < 3; i++) {
  app.cat();
}

module.exports = GirlyGirl;