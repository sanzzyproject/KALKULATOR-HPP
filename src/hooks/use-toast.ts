export function toast({ title, description, variant }: { title?: string; description?: string; variant?: "default" | "destructive" }) {
  console.log(`[TOAST] ${variant || "info"}: ${title} - ${description}`);
}
