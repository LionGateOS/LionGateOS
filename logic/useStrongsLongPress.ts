import { useCallback, useState } from "react";
import { STRONGS_ENABLED } from "./strongFeatureFlag";
import { lookupStrongs, StrongsEntry } from "./strongIndex";

export function useStrongsLongPress() {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<StrongsEntry[]>([]);
  const [verseRef, setVerseRef] = useState("");

  const onLongPress = useCallback((verseKey: string, refLabel: string) => {
    if (!STRONGS_ENABLED) return;
    const res = lookupStrongs(verseKey);
    if (!res || res.length === 0) return;
    setEntries(res);
    setVerseRef(refLabel);
    setVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setVisible(false);
    setEntries([]);
    setVerseRef("");
  }, []);

  return { visible, entries, verseRef, onLongPress, onClose };
}
