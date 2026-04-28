import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Tags } from "lucide-react";
import { notFound } from "next/navigation";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { CtaBand } from "@/components/marketing";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/marketing/markdown-content";
import { getBlogPostBySlug } from "@/lib/cms-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { publishedOnly: true });
  if (!post) return { title: "Actualité introuvable" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
  };
}

function formatDate(value?: string) {
  if (!value) return "Publication EBM";
  return new Intl.DateTimeFormat("fr-TN", { dateStyle: "long" }).format(new Date(value));
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { publishedOnly: true });
  if (!post) {
    notFound();
  }

  return (
    <LazyMotionProvider>
      <article>
        <header className="border-b bg-ebm-navy text-white">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <Link href="/actualites" className="text-sm text-white/70 transition hover:text-white">
              ← Actualités
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                  <Tags className="size-3" />
                  {tag}
                </Badge>
              ))}
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                <CalendarDays className="size-3" />
                {formatDate(post.publishedAt)}
              </Badge>
            </div>
            <h1 className="font-heading mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">{post.excerpt}</p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      <CtaBand
        eyebrow="Besoin d'une estimation ?"
        title="Transformez la lecture en premier cadrage projet."
        body="Le simulateur donne une première fourchette, puis l'équipe EBM affine avec vous."
        primary={{ label: "Lancer le simulateur", href: "/simulateur" }}
        secondary={{ label: "Contacter EBM", href: "/contact" }}
      />
    </LazyMotionProvider>
  );
}
