"use client";

import { useOnlineStatus } from "@/lib/onlineStatus";
import { enqueue } from "@/lib/syncQueue";
import { db } from "@/lib/db/localDb";
import type { PosDatabase } from "@/lib/db/localDb";
import { api } from "@/trpc/react";

type MutationLike<TInput> = {
  mutateAsync: (input: TInput) => Promise<unknown>;
};

export function useOfflineMutation<TInput>(
  trpcMutation: MutationLike<TInput>,
  localAction: (input: TInput, db: PosDatabase) => Promise<void>,
  trpcPath: string,
) {
  const isOnline = useOnlineStatus();
  const utils = api.useUtils();

  const mutate = async (input: TInput): Promise<void> => {
    if (isOnline) {
      await trpcMutation.mutateAsync(input);
    } else {
      await localAction(input, db);
      await enqueue(trpcPath, input);
      await utils.invalidate();
    }
  };

  return { mutate, isOnline };
}
