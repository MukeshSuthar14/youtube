export default {
    API_URI: async (removeApi: boolean = false): Promise<string> => {
        let hostname: string | null = "localhost";
        if (typeof window == "undefined") {
            const headers = import("next/headers");
            hostname = (await (await headers).headers()).get('host');
            hostname = hostname?.split(":")[0] as string;
        } else {
            hostname = window?.location?.hostname;
        }
        return `http://${hostname}:3001/${!removeApi ? 'api/': ''}`
    },
    SITE_URL: async (): Promise<string> => {
        let hostname: string | null = "localhost";
        if (typeof window == "undefined") {
            const headers = import("next/headers");
            hostname = (await (await headers).headers()).get('host');
            hostname = hostname?.split(":")[0] as string;
        } else {
            hostname = window?.location?.hostname;
        }
        return `http://${hostname}:3000/`
    },
}