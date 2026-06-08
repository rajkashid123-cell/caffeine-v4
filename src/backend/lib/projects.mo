import Common "../types/common";
import ProjectTypes "../types/project";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";

module {
  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /// Build a new Project record from creation parameters.
  public func create(
    id : Common.ProjectId,
    name : Text,
    icon : Text,
    iconColor : Text,
    category : ProjectTypes.AppCategory,
    now : Common.Timestamp,
  ) : ProjectTypes.Project {
    {
      id;
      name;
      icon;
      iconColor;
      category;
      answers = "{}";
      specSections = [];
      metadata = {
        tags = [];
        priority = null;
        maturity = #idea;
        attentionFlag = false;
        builderMode = #guided;
      };
      versionHistory = [{
        version = "1.0";
        timestamp = now;
        changeSummary = "Created";
        specSnapshot = "{}";
      }];
      deploymentStatus = #notDeployed;
      createdAt = now;
      updatedAt = now;
    };
  };

  // ---------------------------------------------------------------------------
  // Mutations returning updated copies
  // ---------------------------------------------------------------------------

  /// Return a project with its answers JSON replaced.
  public func setAnswers(
    project : ProjectTypes.Project,
    answers : Text,
    now : Common.Timestamp,
  ) : ProjectTypes.Project {
    let lastVersion = if (project.versionHistory.size() > 0) {
      project.versionHistory[project.versionHistory.size() - 1].version;
    } else { "1.0" };
    let newVersion = bumpMinor(lastVersion);
    let newEntry : ProjectTypes.ProjectVersion = {
      version = newVersion;
      timestamp = now;
      changeSummary = "Answers updated";
      specSnapshot = project.answers;
    };
    let trimmed = trimHistory(project.versionHistory, newEntry);
    { project with answers; versionHistory = trimmed; updatedAt = now };
  };

  /// Return a project with its spec sections replaced and a new version appended.
  public func setSpec(
    project : ProjectTypes.Project,
    sections : [ProjectTypes.SpecSection],
    now : Common.Timestamp,
  ) : ProjectTypes.Project {
    let lastVersion = if (project.versionHistory.size() > 0) {
      project.versionHistory[project.versionHistory.size() - 1].version;
    } else { "1.0" };
    let newVersion = bumpMinor(lastVersion);
    let newEntry : ProjectTypes.ProjectVersion = {
      version = newVersion;
      timestamp = now;
      changeSummary = "Spec updated";
      specSnapshot = project.answers;
    };
    let trimmed = trimHistory(project.versionHistory, newEntry);
    { project with specSections = sections; versionHistory = trimmed; updatedAt = now };
  };

  /// Return a project with its metadata replaced.
  public func setMetadata(
    project : ProjectTypes.Project,
    metadata : ProjectTypes.MetadataUpdate,
    now : Common.Timestamp,
  ) : ProjectTypes.Project {
    let newMeta : ProjectTypes.ProjectMetadata = {
      tags = metadata.tags;
      priority = metadata.priority;
      maturity = metadata.maturity;
      attentionFlag = metadata.attentionFlag;
      builderMode = metadata.builderMode;
    };
    { project with metadata = newMeta; updatedAt = now };
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /// Clone a project under a new id and name, clearing version history.
  public func duplicate(
    source : ProjectTypes.Project,
    newId : Common.ProjectId,
    newName : Text,
    now : Common.Timestamp,
  ) : ProjectTypes.Project {
    {
      source with
      id = newId;
      name = newName;
      versionHistory = [{
        version = "1.0";
        timestamp = now;
        changeSummary = "Duplicated from " # source.name;
        specSnapshot = source.answers;
      }];
      createdAt = now;
      updatedAt = now;
    };
  };

  /// Return the six hard-coded sample projects.
  public func sampleProjects(now : Common.Timestamp) : [ProjectTypes.Project] {
    let mkMeta = func(
      maturity : ProjectTypes.Maturity,
      priority : ProjectTypes.Priority,
      tags : [Text],
    ) : ProjectTypes.ProjectMetadata {
      { tags; priority = ?priority; maturity; attentionFlag = false; builderMode = #guided };
    };
    let mkVer = func(name : Text) : [ProjectTypes.ProjectVersion] {
      [{ version = "1.0"; timestamp = now; changeSummary = "Sample"; specSnapshot = "{}" }];
    };
    [
      {
        id = "sample-1";
        name = "ClearPath Practice";
        icon = "Stethoscope";
        iconColor = "#2DD4BF";
        category = #booking;
        answers = "{}";
        specSections = [
          { heading = "Overview"; content = "A booking platform for healthcare practitioners." },
          { heading = "Features"; content = "Appointment scheduling, patient records, reminders." },
          { heading = "Audience"; content = "Patients and healthcare providers." },
        ];
        metadata = mkMeta(#live, #high, ["healthcare", "booking"]);
        versionHistory = mkVer("ClearPath Practice");
        deploymentStatus = #live;
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "sample-2";
        name = "Community Hub";
        icon = "Users";
        iconColor = "#818CF8";
        category = #social;
        answers = "{}";
        specSections = [];
        metadata = mkMeta(#live, #medium, ["community", "social"]);
        versionHistory = mkVer("Community Hub");
        deploymentStatus = #live;
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "sample-3";
        name = "VaultEx Records";
        icon = "Lock";
        iconColor = "#F59E0B";
        category = #contentCms;
        answers = "{}";
        specSections = [];
        metadata = mkMeta(#building, #high, ["content", "records"]);
        versionHistory = mkVer("VaultEx Records");
        deploymentStatus = #notDeployed;
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "sample-4";
        name = "Training Logger";
        icon = "Activity";
        iconColor = "#FB7185";
        category = #tracker;
        answers = "{}";
        specSections = [];
        metadata = mkMeta(#defining, #medium, ["fitness", "tracking"]);
        versionHistory = mkVer("Training Logger");
        deploymentStatus = #notDeployed;
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "sample-5";
        name = "Content Studio";
        icon = "Layers";
        iconColor = "#38BDF8";
        category = #contentCms;
        answers = "{}";
        specSections = [];
        metadata = mkMeta(#exploring, #low, ["content", "media"]);
        versionHistory = mkVer("Content Studio");
        deploymentStatus = #notDeployed;
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "sample-6";
        name = "EduPath";
        icon = "BookOpen";
        iconColor = "#34D399";
        category = #dashboard;
        answers = "{}";
        specSections = [];
        metadata = mkMeta(#idea, #low, ["education"]);
        versionHistory = mkVer("EduPath");
        deploymentStatus = #notDeployed;
        createdAt = now;
        updatedAt = now;
      },
    ];
  };

  /// True when the project id belongs to a sample project.
  public func isSample(id : Common.ProjectId) : Bool {
    id.startsWith(#text "sample-");
  };

  // ---------------------------------------------------------------------------
  // ID generation
  // ---------------------------------------------------------------------------

  /// Produce a pseudo-random Text id from a counter value.
  public func makeId(counter : Nat) : Common.ProjectId {
    "proj-" # counter.toText();
  };
  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /// Bump the minor part of a version string "major.minor" by 1.
  func bumpMinor(v : Text) : Text {
    let parts = v.split(#char '.');
    switch (parts.next()) {
      case (?major) {
        let prefix = major # ".";
        let rest = v.stripStart(#text prefix);
        switch (rest) {
          case (?minorText) {
            switch (Nat.fromText(minorText)) {
              case (?m) { major # "." # Nat.toText(m + 1) };
              case null { v # ".1" };
            };
          };
          case null { v # ".1" };
        };
      };
      case null { "1.1" };
    };
  };

  /// Append newEntry to history and trim to 20 max entries.
  func trimHistory(
    history : [ProjectTypes.ProjectVersion],
    newEntry : ProjectTypes.ProjectVersion,
  ) : [ProjectTypes.ProjectVersion] {
    let combined = history.concat([newEntry]);
    let sz = combined.size();
    if (sz > 20) {
      let start : Int = sz - 20;
      combined.sliceToArray(start, sz);
    } else {
      combined;
    };
  };
};
