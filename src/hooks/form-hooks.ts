import { createFormHook } from "@tanstack/react-form";
import { AppFormHookContexts } from "./form-hook-contexts";

export const AppFormHooks = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext: AppFormHookContexts.fieldContext,
  formContext: AppFormHookContexts.formContext,
});
