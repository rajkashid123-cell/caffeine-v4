module {
  // Sort options available in the Organize card grid
  public type SortBy = {
    #name;
    #createdAt;
    #updatedAt;
    #priority;
  };

  // Active filter state persisted across sessions
  public type OrganizeFilters = {
    tags : [Text];
    priority : ?{ #high; #medium; #low };
    maturity : ?{ #idea; #exploring; #defining; #building; #live };
    deploymentStatus : ?{ #notDeployed; #live; #failed };
  };

  // Full UI state snapshot for cross-session continuity
  public type UIState = {
    activeMode : Text;         // "design" | "iterate" | "organize" | "manage"
    sidebarCollapsed : Bool;
    activeProjectId : ?Text;
    organizeFilters : OrganizeFilters;
    organizeSortBy : SortBy;
  };
};
