import Map "mo:core/Map";
import ProjectTypes "types/project";
import UITypes "types/ui";
import Common "types/common";
import ProjectsApi "mixins/projects-api";
import UIApi "mixins/ui-api";
import OnboardingApi "mixins/onboarding-api";

actor {
  // ─── Stable state ────────────────────────────────────────────────────────
  let projects = Map.empty<Common.ProjectId, ProjectTypes.Project>();
  let idState = { var nextId : Nat = 0 };
  let uiHolder = { var current : ?UITypes.UIState = null };
  let onboardingHolder = { var complete : Bool = false };

  // ─── Mixin composition ───────────────────────────────────────────────────
  include ProjectsApi(projects, idState);
  include UIApi(uiHolder);
  include OnboardingApi(onboardingHolder);
};
