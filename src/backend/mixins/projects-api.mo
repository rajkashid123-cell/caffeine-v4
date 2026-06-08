import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import ProjectTypes "../types/project";
import Common "../types/common";
import ProjectLib "../lib/projects";
import Array "mo:core/Array";

/// Exposes the public CRUD API for the project domain.
mixin (
  projects : Map.Map<Common.ProjectId, ProjectTypes.Project>,
  state : { var nextId : Nat },
) {

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  public func createProject(
    name : Text,
    icon : Text,
    iconColor : Text,
    category : ProjectTypes.AppCategory,
  ) : async ProjectTypes.Project {
    let now : Common.Timestamp = Int.abs(Time.now()) / 1_000_000;
    let id = ProjectLib.makeId(state.nextId);
    state.nextId += 1;
    let project = ProjectLib.create(id, name, icon, iconColor, category, now);
    projects.add(id, project);
    project;
  };

  public query func getProject(id : Common.ProjectId) : async ?ProjectTypes.Project {
    projects.get(id);
  };

  public query func listProjects() : async [ProjectTypes.Project] {
    var result : [ProjectTypes.Project] = [];
    for ((_, p) in projects.entries()) {
      result := result.concat([p]);
    };
    result;
  };

  public func updateProjectAnswers(
    id : Common.ProjectId,
    answers : Text,
  ) : async ?ProjectTypes.Project {
    let now : Common.Timestamp = Int.abs(Time.now()) / 1_000_000;
    switch (projects.get(id)) {
      case (?p) {
        let updated = ProjectLib.setAnswers(p, answers, now);
        projects.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func updateProjectSpec(
    id : Common.ProjectId,
    sections : [ProjectTypes.SpecSection],
  ) : async ?ProjectTypes.Project {
    let now : Common.Timestamp = Int.abs(Time.now()) / 1_000_000;
    switch (projects.get(id)) {
      case (?p) {
        let updated = ProjectLib.setSpec(p, sections, now);
        projects.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func updateProjectMetadata(
    id : Common.ProjectId,
    metadata : ProjectTypes.MetadataUpdate,
  ) : async ?ProjectTypes.Project {
    let now : Common.Timestamp = Int.abs(Time.now()) / 1_000_000;
    switch (projects.get(id)) {
      case (?p) {
        let updated = ProjectLib.setMetadata(p, metadata, now);
        projects.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteProject(id : Common.ProjectId) : async Bool {
    switch (projects.get(id)) {
      case (?_) { projects.remove(id); true };
      case null { false };
    };
  };

  public func duplicateProject(
    id : Common.ProjectId,
    newName : Text,
  ) : async ?ProjectTypes.Project {
    let now : Common.Timestamp = Int.abs(Time.now()) / 1_000_000;
    switch (projects.get(id)) {
      case (?source) {
        let newId = ProjectLib.makeId(state.nextId);
        state.nextId += 1;
        let duped = ProjectLib.duplicate(source, newId, newName, now);
        projects.add(newId, duped);
        ?duped;
      };
      case null { null };
    };
  };

  // ---------------------------------------------------------------------------
  // Sample data
  // ---------------------------------------------------------------------------

  /// Seeds the six sample projects if the project map is currently empty.
  public func seedSampleProjects() : async [ProjectTypes.Project] {
    if (projects.size() > 0) {
      var result : [ProjectTypes.Project] = [];
      for ((_, p) in projects.entries()) {
        result := result.concat([p]);
      };
      return result;
    };
    let now : Common.Timestamp = Int.abs(Time.now()) / 1_000_000;
    let samples = ProjectLib.sampleProjects(now);
    for (s in samples.vals()) {
      projects.add(s.id, s);
    };
    samples;
  };

  public query func isSampleProject(id : Common.ProjectId) : async Bool {
    ProjectLib.isSample(id);
  };
};
