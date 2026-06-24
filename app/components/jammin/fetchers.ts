import type BrowserDetector from "browser-dtector";

export interface IpData {
    ip: string;
    country: string;
    region: string;
    city: string;
    zip: string;
    location: string;
    lat: number;
    lon: number;
    timezone: string;
    time: string;
    isp: string;
    org: string;
    as: string;
}

export interface GpuData {
    vendor: string | null;
    info: string | null;
}

export type UserAgentData = ReturnType<BrowserDetector["parseUserAgent"]>;

export const fetchIpData = async (): Promise<IpData> => {
    const basic = await fetch("https://wtfismyip.com/json").then((res) =>
        res.json(),
    );
    const detailed = await fetch(
        `https://ip.cypher.com?ip=${basic.YourFuckingIPAddress}`,
    ).then((res) => res.json());

    return {
        ip: basic.YourFuckingIPAddress,
        country: detailed.country,
        region: detailed.regionName,
        city: detailed.city,
        zip: detailed.zip,
        location: basic.YourFuckingLocation,
        lat: detailed.lat,
        lon: detailed.lon,
        timezone: detailed.timezone,
        time: new Date().toLocaleString(),
        isp: detailed.isp,
        org: detailed.org,
        as: detailed.as,
    };
};

export const getGpuData = async (): Promise<GpuData> => {
    const canvas = document.createElement("canvas");
    let gl: WebGLRenderingContext | null = null;
    let debugInfo: WEBGL_debug_renderer_info | null = null;

    try {
        gl =
            canvas.getContext("webgl") ||
            (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
        debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    } catch {}

    if (gl && debugInfo) {
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            info: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        };
    }

    return {
        vendor: null,
        info: null,
    };
};

export const dataToText = (
    ipData: IpData,
    gpuData: GpuData,
    userAgentData: UserAgentData,
): string[] =>
    [
        `IP Address: ${ipData.ip}`,
        `Country: ${ipData.country}`,
        `Region: ${ipData.region}`,
        `City: ${ipData.city}`,
        `ZIP Code: ${ipData.zip}`,
        `Full Location: ${ipData.location}`,
        `Latitude: ${ipData.lat}`,
        `Longitude: ${ipData.lon}`,
        `Timezone: ${ipData.timezone}`,
        `Current Time: ${ipData.time}`,
        `ISP: ${ipData.isp}`,
        `Organization: ${ipData.org}`,
        `Autonomous System: ${ipData.as}`,
        `Browser Name: ${userAgentData.name}`,
        `Platform Name: ${userAgentData.platform}`,
        `Browser Version: ${userAgentData.version}`,
        `Mobile/Tablet: ${
            userAgentData.isMobile || userAgentData.isTablet ? "Yes" : "No"
        }`,
        `Referrer: ${document.referrer || "None"}`,
        `System Languages: ${navigator.languages.join(", ")}`,
        `Screen Width: ${screen.width}px`,
        `Screen Height: ${screen.height}px`,
        screen.width !== window.innerWidth ||
        screen.height !== window.innerHeight
            ? `Window Width: ${window.outerWidth}px`
            : null,
        screen.width !== window.innerWidth ||
        screen.height !== window.innerHeight
            ? `Window Height: ${window.outerHeight}px`
            : null,
        `Display Pixel Depth: ${screen.pixelDepth}`,
        typeof screen.orientation !== "undefined"
            ? `Screen Orientation: ${screen.orientation.type.split("-")[0]}`
            : null,
        typeof screen.orientation !== "undefined"
            ? `Screen Rotation: ${screen.orientation.angle} degrees`
            : null,
        `CPU Threads: ${navigator.hardwareConcurrency}`,
        gpuData.vendor ? `GPU Vendor: ${gpuData.vendor}` : null,
        gpuData.info ? `GPU Info: ${gpuData.info}` : null,
    ].filter((s) => s !== null);
