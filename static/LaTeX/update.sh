#! /bin/bash
for filename in *; do
	if [[ $filename =~ cv_([0-9-]*).pdf ]]
	then
		cp $filename ../pdfs/chrisantha.pdf
	fi
	if [[ $filename =~ cv_([0-9-]*).* ]]
	then
		match=${BASH_REMATCH[1]}
		newdate=`date +%Y-%m-%d`
		newname=${filename//$match/$newdate}
		echo $newname
		mv $filename $newname
	fi
done	
