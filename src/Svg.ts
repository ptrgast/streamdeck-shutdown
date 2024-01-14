import { readFileSync } from 'fs';


/**
 * Helper class for loading SVGs and creating derivatives by replacing specific parts
 * with simple string searches.
 */
export class Svg {

	private svg: string = "";
	private searches: Array<string>;

	constructor(svgPath: string, searches: Array<string>) {
		this.svg = "data:image/svg+xml;charset=utf8," + readFileSync(svgPath, "utf8");
		this.searches = searches;
	}

	createImage(replacements: Array<string>) {
		let output = this.svg;
		for (const index in this.searches) {			
			output = output.replaceAll(this.searches[index], replacements[index]);
		}
		return output;
	}

}