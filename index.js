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
}

const app = new GirlyGirl();
app.initialize();
app.addFeature('Initial setup');
app.addFeature('Basic structure');
app.listFeatures();

module.exports = GirlyGirl;