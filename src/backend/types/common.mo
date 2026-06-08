import Time "mo:core/Time";

module {
  public type Timestamp = Int; // nanoseconds from Time.now()
  public type ProjectId = Text; // UUID-style, e.g. "proj_abc123"
};
