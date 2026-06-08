
/// Exposes the public API for onboarding completion tracking.
mixin (onboarding : { var complete : Bool }) {

  public func markOnboardingComplete() : async () {
    onboarding.complete := true;
  };

  public query func isOnboardingComplete() : async Bool {
    onboarding.complete;
  };
};
