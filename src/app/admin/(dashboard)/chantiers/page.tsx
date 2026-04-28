import { ChantiersManager } from "@/app/admin/(dashboard)/chantiers/chantiers-manager";
import { listChantierAssets, listProjects, listServicePages } from "@/lib/cms-content";

export default async function AdminChantiersPage() {
  const [assets, projects, services] = await Promise.all([
    listChantierAssets(),
    listProjects(),
    listServicePages(),
  ]);

  return <ChantiersManager initialAssets={assets} projects={projects} services={services} />;
}
