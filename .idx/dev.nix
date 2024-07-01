{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
    # Sets environment variables in the workspace
  env = {
    DATABASE_URL="file:./db.sqlite";
    NEXTAUTH_SECRET="3g3hergaeg4rgrthth";
    NEXTAUTH_URL="https://9000-idx-nextjs-pos-app-1719831951697.cluster-4ezwrnmkojawstf2k7vqy36oe6.cloudworkstations.dev/";
    DISCORD_CLIENT_ID="dasdofasfdfaf";
    DISCORD_CLIENT_SECRET="h4heqrte";
  };

  idx.extensions = [
    
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}