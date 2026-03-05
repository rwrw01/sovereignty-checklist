import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-mxi-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Digitale Soevereiniteit,{" "}
            <span className="text-mxi-blue">inzichtelijk gemaakt</span>
          </h1>
          <p className="text-lg text-white/70 mb-4 max-w-2xl mx-auto">
            Een afwegingskader dat richting geeft. Niet of u soeverein bent,
            maar of u weet waar u staat en een bewuste keuze maakt.
          </p>
          <p className="text-sm text-white/50 mb-8 max-w-xl mx-auto">
            Gebaseerd op het EU SEAL framework en lessen uit Nederlandse
            onderzoeken naar Solvinity, SIDN, de Belastingdienst en de
            Rekenkamer.
          </p>
          <Link href="#kies-assessment">
            <Button size="lg">Kies uw assessment</Button>
          </Link>
        </div>
      </section>

      {/* Problem statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Waarom dit kader?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Kyndryl/Solvinity",
                desc: "VS-bedrijf kocht hosting van DigiD. Kabinet hoorde het via de media.",
              },
              {
                title: "SIDN / .nl-domein",
                desc: "Beheerder van .nl migreerde naar AWS. Kamer unaniem: DNS-keten moet in NL blijven.",
              },
              {
                title: "Rekenkamer: Het Rijk in de Cloud",
                desc: "67% van kritieke diensten zonder risicobeoordeling. 1.588 clouddiensten zonder coördinatie.",
              },
              {
                title: "Belastingdienst / M365",
                desc: "€144M migratie naar Microsoft ondanks erkende CLOUD Act-blootstelling.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <h3 className="font-semibold text-mxi-purple mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Track selection */}
      <section id="kies-assessment" className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-3">
            Kies uw assessment
          </h2>
          <p className="text-center text-foreground/60 mb-10 max-w-2xl mx-auto">
            Twee sporen, elk met een eigen focus. Gebruik ze los of samen
            voor een compleet beeld.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SEAL Track */}
            <div className="border-2 border-mxi-purple/20 rounded-2xl p-8 bg-white flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-mxi-purple/10 text-mxi-purple text-xs font-semibold px-3 py-1 rounded-full">
                  Per applicatie / provider
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                SEAL Quick-Scan
              </h3>
              <p className="text-foreground/70 text-sm mb-4 flex-1">
                Beoordeel een specifieke cloudprovider of applicatie op het
                EU SEAL framework. 32 vragen over 8 soevereiniteitscategorieën
                zoals datajurisdictie, portabiliteit en transparantie.
              </p>
              <ul className="text-sm text-foreground/60 mb-6 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-mxi-purple mt-0.5">&#10003;</span>
                  <span>SEAL-niveau 0-4 per categorie</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mxi-purple mt-0.5">&#10003;</span>
                  <span>Gewogen totaalscore met radarchart</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mxi-purple mt-0.5">&#10003;</span>
                  <span>Kritieke vlaggen en PDF-rapport</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mxi-purple mt-0.5">&#10003;</span>
                  <span>~15 minuten</span>
                </li>
              </ul>
              <Link href="/assessment/new?type=seal">
                <Button size="lg" className="w-full">Start SEAL Quick-Scan</Button>
              </Link>
            </div>

            {/* SRA Track */}
            <div className="border-2 border-mxi-blue/20 rounded-2xl p-8 bg-white flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-mxi-blue/10 text-mxi-blue text-xs font-semibold px-3 py-1 rounded-full">
                  Organisatiebreed
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Soevereiniteits Gereedheids Assessment
              </h3>
              <p className="text-foreground/70 text-sm mb-4 flex-1">
                Beoordeel hoe goed uw organisatie is voorbereid op digitale
                soevereiniteit. 36 vragen over bewustzijn, governance,
                risicoanalyse, verborgen afhankelijkheden en meer.
              </p>
              <ul className="text-sm text-foreground/60 mb-6 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-mxi-blue mt-0.5">&#10003;</span>
                  <span>9 thema&apos;s gebaseerd op NL-onderzoeken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mxi-blue mt-0.5">&#10003;</span>
                  <span>Surfaced verborgen afhankelijkheden (Entra ID, PKI, MDM)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mxi-blue mt-0.5">&#10003;</span>
                  <span>Roadmap-gereedheid: ook &quot;we zijn ermee bezig&quot; telt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mxi-blue mt-0.5">&#10003;</span>
                  <span>~20 minuten</span>
                </li>
              </ul>
              <Link href="/assessment/new?type=sra">
                <Button size="lg" variant="outline" className="w-full">
                  Start SRA Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mxi-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Inzicht in 15-20 minuten
          </h2>
          <p className="text-white/60 mb-4">
            Geen account nodig. Uw resultaten zijn direct beschikbaar
            inclusief een downloadbaar PDF-rapport.
          </p>
          <p className="text-white/40 text-sm">
            Een bewuste keuze met goede mitigaties is beter dan
            onbewust afhankelijk zijn.
          </p>
        </div>
      </section>
    </div>
  );
}
