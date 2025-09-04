// import connect from "@/db/mongo.config";
// import { NextRequest, NextResponse } from "next/server";
// import RESPONSES from "@/models/responses";
// import FORM from "@/models/form";
// import { iResponses } from "@/types/responses";

// connect();
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     // const form = await Forms.findByIdAndUpdate(body.formid,{$push:{responses:body.response}});
//     const form = await FORM.findById(body.formid);

//     const UserResponse: iResponses = {};
//     form.fields.map((field: any) => {
//       if (body.response[field.uniqueID]) {
//         if (body.response[field.uniqueID]?.type === "checkbox") {
//           return (UserResponse[field.uniqueID] = {
//             ...body.response[field.uniqueID],
//             answer: field.options
//               .filter(
//                 (option: any) =>
//                   body.response[field.uniqueID].answer[option] === true
//               )
//               .join(", "),
//           });
//         }
//         return (UserResponse[field.uniqueID] = body.response[field.uniqueID]);
//       }
//     });
//     const curerntdate = new Date();
//     console.log("2", curerntdate, form?.expiry_date);
//     if (curerntdate > form?.expiry_date && form?.state === "Live") {
//       form.state = "Expired";
//       await form.save();
//       return NextResponse.json(
//         { msg: "The form is expired", status: 400 },
//         { status: 200 }
//       );
//     }

//     const IsRequiredData: Array<any> = [];

//     form.fields.map((field: any) => {
//       if (field.required && !UserResponse[field.uniqueID]?.answer) {
//         return (IsRequiredData[field.uniqueID] = field.title);
//       }
//     });

//     if (Object.keys(IsRequiredData).length > 0) {
//       return NextResponse.json(
//         { msg: "Please fill all the required fields", status: 400 },
//         { status: 200 }
//       );
//     }

//     if (body.user) {
//       var response = await RESPONSES.create({
//         responded_user: body.user,
//         response: UserResponse,
//         form: body.formid,
//         for: "form"
//       });
//     } else {
//       var response = await RESPONSES.create({
//         response: UserResponse,
//         form: body.formid,
//         for: "form"
//       });
//     }

//     if (!response) {
//       return NextResponse.json(
//         { msg: "Form not found", status: 400 },
//         { status: 200 }
//       );
//     }
//     return NextResponse.json(
//       { msg: "Form Submitted succesfully", status: 200 },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("PostFormFieldData error -------->", error);
//     return NextResponse.json({ msg: error, status: 400 }, { status: 200 });
//   }
// }


import connect from "@/db/mongo.config";
import { NextRequest, NextResponse } from "next/server";
import RESPONSES from "@/models/responses";
import FORM from "@/models/form";
import { iResponses } from "@/types/responses";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const form = await FORM.findById(body.formid);

    if (!form) {
      return NextResponse.json(
        { msg: "Form not found", status: 400 },
        { status: 200 }
      );
    }

    // --- Check expiry ---
    const currentDate = new Date();
    if (currentDate > form.expiry_date && form.state === "Live") {
      form.state = "Expired";
      await form.save();
      return NextResponse.json(
        { msg: "The form is expired", status: 400 },
        { status: 200 }
      );
    }

    // --- Prepare user response ---
    const UserResponse: iResponses = {};
    form.fields.forEach((field: any) => {
      if (body.response[field.uniqueID]) {
        if (body.response[field.uniqueID]?.type === "checkbox") {
          UserResponse[field.uniqueID] = {
            ...body.response[field.uniqueID],
            answer: field.options
              .filter(
                (option: any) =>
                  body.response[field.uniqueID].answer[option] === true
              )
              .join(", "),
          };
        } else {
          UserResponse[field.uniqueID] = body.response[field.uniqueID];
        }
      }
    });

    // --- Validate required fields ---
    const missingRequired: string[] = [];
    form.fields.forEach((field: any) => {
      if (field.required && !UserResponse[field.uniqueID]?.answer) {
        missingRequired.push(field.title);
      }
    });

    if (missingRequired.length > 0) {
      return NextResponse.json(
        { msg: "Please fill all the required fields", missing: missingRequired, status: 400 },
        { status: 200 }
      );
    }

    // --- Save response ---
    const response = await RESPONSES.create({
      responded_user: body.user || null,
      response: UserResponse,
      form: body.formid,
      for: "form",
    });

    if (!response) {
      return NextResponse.json(
        { msg: "Failed to save response", status: 400 },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { msg: "Form submitted successfully", status: 200 },
      { status: 200 }
    );

  } catch (error) {
    console.error("PostFormFieldData error -------->", error);
    return NextResponse.json({ msg: error, status: 400 }, { status: 200 });
  }
}
