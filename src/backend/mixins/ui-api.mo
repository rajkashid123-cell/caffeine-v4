import UITypes "../types/ui";

/// Exposes the public API for persisting UI state.
mixin (uiState : { var current : ?UITypes.UIState }) {

  public func saveUIState(state : UITypes.UIState) : async () {
    uiState.current := ?state;
  };

  public query func getUIState() : async ?UITypes.UIState {
    uiState.current;
  };
};
