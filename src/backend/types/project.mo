import Common "common";

module {
  // Broad app category for seeded suggestions and type-filtered features
  public type AppCategory = {
    #dashboard;
    #marketplace;
    #social;
    #contentCms;
    #booking;
    #tracker;
    #clubManager;
    #internalTool;
    #other;
  };

  // Priority level for portfolio organisation
  public type Priority = {
    #high;
    #medium;
    #low;
  };

  // Maturity stage in the project lifecycle
  public type Maturity = {
    #idea;
    #exploring;
    #defining;
    #building;
    #live;
  };

  // Simulated deployment status (no real deployment occurs)
  public type DeploymentStatus = {
    #notDeployed;
    #live;
    #failed;
  };

  // Which build mode the user chose for their interview
  public type BuilderMode = {
    #guided;
    #feel;
    #standard;
  };

  // One immutable version snapshot of the spec
  public type ProjectVersion = {
    version : Text;       // e.g. "1.0", "1.1"
    timestamp : Common.Timestamp;
    changeSummary : Text;
    specSnapshot : Text;  // JSON-encoded sections at this version
  };

  // A single section of the generated specification
  public type SpecSection = {
    heading : Text;
    content : Text;
  };

  // Editable metadata managed in Organize mode
  public type ProjectMetadata = {
    tags : [Text];
    priority : ?Priority;
    maturity : Maturity;
    attentionFlag : Bool;
    builderMode : BuilderMode;
  };

  // Full project record (shared — no var fields, no mutable containers)
  public type Project = {
    id : Common.ProjectId;
    name : Text;
    icon : Text;           // Lucide icon name, e.g. "Layers"
    iconColor : Text;      // CSS colour token, e.g. "muted-teal"
    category : AppCategory;
    answers : Text;        // JSON blob of Design-flow choices
    specSections : [SpecSection];
    metadata : ProjectMetadata;
    versionHistory : [ProjectVersion];
    deploymentStatus : DeploymentStatus;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  // Metadata subset accepted on update (prevents full record replacement)
  public type MetadataUpdate = {
    tags : [Text];
    priority : ?Priority;
    maturity : Maturity;
    attentionFlag : Bool;
    builderMode : BuilderMode;
  };
};
