import { NextResponse, type NextRequest } from "next/server";

const SPANISH_SPEAKING_COUNTRIES = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

function preferredLocale(request: NextRequest): "es" | "en" {
  const country = (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    ""
  ).toUpperCase();

  if (country) {
    return SPANISH_SPEAKING_COUNTRIES.has(country) ? "es" : "en";
  }

  const acceptedLanguages = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return acceptedLanguages.includes("es") ? "es" : "en";
}

export function proxy(request: NextRequest) {
  return NextResponse.redirect(
    new URL(`/${preferredLocale(request)}`, request.url),
  );
}

export const config = {
  matcher: ["/"],
};
