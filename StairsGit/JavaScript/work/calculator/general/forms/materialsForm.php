<div>
	<h2 class="raschet">Материалы</h2>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Покраска металла (каркас):</td>
				<td>
					<select id="metalPaint" size="1">
						<!-- варианты покраски металла -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalPaint.php" ?>
					</select>
				</td>
			</tr>

			<tr>
				<td>Покраска металла (ограждения):</td>
				<td>
					<select id="metalPaint_railing" size="1">
						<!-- варианты покраски металла -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalPaint.php" ?>
					</select>
				</td>
			</tr>

			<tr class="timberPaint">
				<td>Покраска дерева:</td>
				<td>
					<select id="timberPaint" size="1">
						<!-- варианты покраски дерева -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberPaint.php" ?>
					</select>
				</td>
			</tr>

			<tr class="timberPaint">
				<td>Поверхность дерева:</td>
				<td>
					<select id="surfaceType" size="1">
						<!-- варианты покраски дерева -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/surfaceTypes.php" ?>
					</select>
				</td>
			</tr>

			<tr class="timberPaint">
				<td>Шпаклевка:</td>
				<td>
					<select id="fillerType" size="1">
						<!-- варианты покраски дерева -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/fillerTypes.php" ?>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
</div>
<div>
	<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/colorsForm.php" ?>
</div>

<br/>
<button class='showTextures btn btn-primary' type="button" name="button">Включить текстуры</button><br/>