import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container flex min-h-screen flex-col items-center justify-center gap-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
          <Sparkles className="h-4 w-4" />
          Freshly remixed
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Your new project is ready to build
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Tell me what you want to create and I'll start shaping it — a landing page,
          a dashboard, an app, anything you have in mind.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="gap-2">
            Get started <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;
