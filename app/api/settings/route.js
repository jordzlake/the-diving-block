import { Settings } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { settingsSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    connectToDb();
    const settings = await Settings.find();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};

export const POST = async (req, res) => {
  const { settings } = await req.json();
  try {
    await connectToDb();

    const existingSettings = await Settings.findById(settings._id);
    if (!existingSettings) {
      return NextResponse.json({
        errors: ["No settings with that ID exists to be updated"],
      });
    }

    const validationResult = settingsSchema.safeParse(settings);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) =>
          `${issue.path}: 
          ${issue.message}`
      );
      return NextResponse.json({ errors });
    }

    const updatedSettings = await Settings.findByIdAndUpdate(settings._id, {
      categories: settings.categories,
      sizes: settings.sizes,
      locations: settings.locations,
      sales: settings.sales,
      sitesale: settings.sitesale,
      colors: settings.colors ? settings.colors : [],
    });

    return NextResponse.json({ success: updatedSettings });
  } catch (err) {
    return NextResponse.json({ error: [err.message] });
  }
};
