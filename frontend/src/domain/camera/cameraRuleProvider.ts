/**
 * Single Source of Truth (SOT) for Camera business rules
 * and field visibility gating on the frontend.
 */
export class CameraRuleProvider {
  /**
   * Determines if a specific configuration field should be visible in the UI
   * based on the current dynamic state of the camera.
   */
  public static isFieldVisible(field: string, camera: any): boolean {
    if (!camera) return false;

    const brand = (camera.brand as string) || "";
    const managedByController = !!camera.managedByController;
    const isBrandCompatible = brand === "CAMERA_UNDEFINED" || brand.includes("Keyence");

    if (field === "managedByController") {
      return isBrandCompatible;
    }

    switch (field) {
      case "controllerName":
      case "controllerId":
      case "channel":
      case "startAreaExchanges":
      case "nbInfos":
      case "exchangesSize":
        return isBrandCompatible && managedByController;
      default:
        return true;
    }
  }
}
